import { db } from "@orksys-survey/db";
import {
	analyticsSnapshot,
	type DemographicsData,
	type QuestionAnalytics,
	type SummaryAnalytics,
	type TrendDataPoint,
} from "@orksys-survey/db/schema/analytics";
import {
	answer,
	question,
	response,
	survey,
} from "@orksys-survey/db/schema/survey";
import { and, count, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { z } from "zod";

import { organizationProcedure } from "../index";

// Verify survey belongs to organization
async function verifySurveyAccess(
	surveyId: string,
	organizationId: string,
): Promise<void> {
	const result = await db
		.select()
		.from(survey)
		.where(
			and(eq(survey.id, surveyId), eq(survey.organizationId, organizationId)),
		)
		.limit(1);

	if (!result[0]) {
		throw new Error("Survey not found");
	}
}

// TTL constants (in milliseconds)
const SUMMARY_TTL = 5 * 60 * 1000; // 5 minutes
const QUESTION_TTL = 10 * 60 * 1000; // 10 minutes
const TRENDS_TTL = 30 * 60 * 1000; // 30 minutes
const DEMOGRAPHICS_TTL = 10 * 60 * 1000; // 10 minutes

// Generate unique IDs
function generateSnapshotId(): string {
	return `as_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// Get cached data or return null if expired/not found
async function getCachedSnapshot<T>(
	surveyId: string,
	type: string,
	questionId?: string,
): Promise<T | null> {
	const conditions = [
		eq(analyticsSnapshot.surveyId, surveyId),
		eq(
			analyticsSnapshot.type,
			type as "summary" | "question" | "trends" | "demographics",
		),
		gte(analyticsSnapshot.expiresAt, new Date()),
	];

	if (questionId) {
		conditions.push(eq(analyticsSnapshot.questionId, questionId));
	}

	const result = await db
		.select()
		.from(analyticsSnapshot)
		.where(and(...conditions))
		.limit(1);

	return result[0]?.data as T | null;
}

// Save data to cache
async function saveCachedSnapshot(
	surveyId: string,
	type: string,
	data: unknown,
	ttlMs: number,
	questionId?: string,
): Promise<void> {
	const expiresAt = new Date(Date.now() + ttlMs);

	await db
		.insert(analyticsSnapshot)
		.values({
			id: generateSnapshotId(),
			surveyId,
			type: type as "summary" | "question" | "trends" | "demographics",
			questionId: questionId ?? null,
			data,
			expiresAt,
		})
		.onConflictDoNothing();
}

export const analyticsRouter = {
	// Get overall survey statistics
	getSummary: organizationProcedure
		.input(z.object({ surveyId: z.string() }))
		.handler(async ({ input, context }) => {
			await verifySurveyAccess(input.surveyId, context.activeOrganization.id);

			// Check cache first
			const cached = await getCachedSnapshot<SummaryAnalytics>(
				input.surveyId,
				"summary",
			);
			if (cached) return cached;

			// Calculate fresh data
			const [totalResult, completeResult, responsesWithTime] =
				await Promise.all([
					db
						.select({ count: count() })
						.from(response)
						.where(eq(response.surveyId, input.surveyId)),
					db
						.select({ count: count() })
						.from(response)
						.where(
							and(
								eq(response.surveyId, input.surveyId),
								eq(response.isComplete, true),
							),
						),
					db
						.select({
							startedAt: response.startedAt,
							completedAt: response.completedAt,
						})
						.from(response)
						.where(
							and(
								eq(response.surveyId, input.surveyId),
								eq(response.isComplete, true),
								sql`${response.completedAt} IS NOT NULL`,
							),
						),
				]);

			const total = totalResult[0]?.count ?? 0;
			const complete = completeResult[0]?.count ?? 0;

			// Calculate average completion time
			let averageTimeSeconds: number | null = null;
			if (responsesWithTime.length > 0) {
				const totalTime = responsesWithTime.reduce((sum, r) => {
					if (r.completedAt && r.startedAt) {
						return sum + (r.completedAt.getTime() - r.startedAt.getTime());
					}
					return sum;
				}, 0);
				averageTimeSeconds = Math.round(
					totalTime / responsesWithTime.length / 1000,
				);
			}

			const result: SummaryAnalytics = {
				totalResponses: total,
				completeResponses: complete,
				partialResponses: total - complete,
				completionRate: total > 0 ? Math.round((complete / total) * 100) : 0,
				averageTimeSeconds,
			};

			// Cache the result
			await saveCachedSnapshot(input.surveyId, "summary", result, SUMMARY_TTL);

			return result;
		}),

	// Get per-question analytics
	getQuestionAnalytics: organizationProcedure
		.input(
			z.object({
				surveyId: z.string(),
				questionId: z.string().optional(),
			}),
		)
		.handler(async ({ input, context }) => {
			await verifySurveyAccess(input.surveyId, context.activeOrganization.id);

			// Get questions for this survey
			const questions = await db
				.select()
				.from(question)
				.where(eq(question.surveyId, input.surveyId))
				.orderBy(question.order);

			if (input.questionId) {
				// Return analytics for single question
				const cached = await getCachedSnapshot<QuestionAnalytics>(
					input.surveyId,
					"question",
					input.questionId,
				);
				if (cached) return [cached];

				const targetQuestion = questions.find((q) => q.id === input.questionId);
				if (!targetQuestion) {
					throw new Error("Question not found");
				}

				const result = await calculateQuestionAnalytics(targetQuestion);
				await saveCachedSnapshot(
					input.surveyId,
					"question",
					result,
					QUESTION_TTL,
					input.questionId,
				);
				return [result];
			}

			// Return analytics for all questions
			const results: QuestionAnalytics[] = [];

			for (const q of questions) {
				const cached = await getCachedSnapshot<QuestionAnalytics>(
					input.surveyId,
					"question",
					q.id,
				);
				if (cached) {
					results.push(cached);
				} else {
					const result = await calculateQuestionAnalytics(q);
					await saveCachedSnapshot(
						input.surveyId,
						"question",
						result,
						QUESTION_TTL,
						q.id,
					);
					results.push(result);
				}
			}

			return results;
		}),

	// Get response trends over time
	getTrends: organizationProcedure
		.input(
			z.object({
				surveyId: z.string(),
				days: z.number().int().min(1).max(365).default(30),
			}),
		)
		.handler(async ({ input, context }) => {
			await verifySurveyAccess(input.surveyId, context.activeOrganization.id);

			// Check cache
			const cacheKey = `trends_${input.days}`;
			const cached = await getCachedSnapshot<TrendDataPoint[]>(
				input.surveyId,
				cacheKey,
			);
			if (cached) return cached;

			const startDate = new Date();
			startDate.setDate(startDate.getDate() - input.days);
			startDate.setHours(0, 0, 0, 0);

			// Get all responses in date range
			const responses = await db
				.select({
					createdAt: response.createdAt,
					isComplete: response.isComplete,
				})
				.from(response)
				.where(
					and(
						eq(response.surveyId, input.surveyId),
						gte(response.createdAt, startDate),
					),
				);

			// Group by date
			const dateMap = new Map<
				string,
				{ responses: number; completions: number }
			>();

			for (const r of responses) {
				const dateParts = r.createdAt.toISOString().split("T");
				const dateKey = dateParts[0] ?? "";
				const existing = dateMap.get(dateKey) || {
					responses: 0,
					completions: 0,
				};
				existing.responses++;
				if (r.isComplete) existing.completions++;
				dateMap.set(dateKey, existing);
			}

			// Fill in missing dates
			const trends: TrendDataPoint[] = [];
			const currentDate = new Date(startDate);
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			while (currentDate <= today) {
				const dateParts = currentDate.toISOString().split("T");
				const dateKey = dateParts[0] ?? "";
				const data = dateMap.get(dateKey) || { responses: 0, completions: 0 };
				trends.push({
					date: dateKey,
					responses: data.responses,
					completions: data.completions,
				});
				currentDate.setDate(currentDate.getDate() + 1);
			}

			// Cache the result
			await saveCachedSnapshot(input.surveyId, cacheKey, trends, TRENDS_TTL);

			return trends;
		}),

	// Get demographic breakdowns
	getDemographics: organizationProcedure
		.input(z.object({ surveyId: z.string() }))
		.handler(async ({ input, context }) => {
			await verifySurveyAccess(input.surveyId, context.activeOrganization.id);

			// Check cache
			const cached = await getCachedSnapshot<DemographicsData>(
				input.surveyId,
				"demographics",
			);
			if (cached) return cached;

			// Get all responses with metadata
			const responses = await db
				.select({ metadata: response.metadata })
				.from(response)
				.where(eq(response.surveyId, input.surveyId));

			// Aggregate demographics
			const browsers = new Map<string, number>();
			const devices = new Map<string, number>();
			const os = new Map<string, number>();
			const countries = new Map<string, number>();

			for (const r of responses) {
				if (r.metadata) {
					const meta = r.metadata as {
						browser?: string;
						device?: string;
						os?: string;
						country?: string;
					};
					if (meta.browser) {
						browsers.set(meta.browser, (browsers.get(meta.browser) || 0) + 1);
					}
					if (meta.device) {
						devices.set(meta.device, (devices.get(meta.device) || 0) + 1);
					}
					if (meta.os) {
						os.set(meta.os, (os.get(meta.os) || 0) + 1);
					}
					if (meta.country) {
						countries.set(meta.country, (countries.get(meta.country) || 0) + 1);
					}
				}
			}

			const total = responses.length || 1;

			const toSortedArray = (map: Map<string, number>) =>
				Array.from(map.entries())
					.sort((a, b) => b[1] - a[1])
					.slice(0, 10)
					.map(([name, count]) => ({
						name,
						count,
						percentage: Math.round((count / total) * 100),
					}));

			const result: DemographicsData = {
				browsers: toSortedArray(browsers),
				devices: toSortedArray(devices),
				os: toSortedArray(os),
				countries: toSortedArray(countries),
			};

			// Cache the result
			await saveCachedSnapshot(
				input.surveyId,
				"demographics",
				result,
				DEMOGRAPHICS_TTL,
			);

			return result;
		}),

	// Export responses as CSV/JSON
	exportResponses: organizationProcedure
		.input(
			z.object({
				surveyId: z.string(),
				format: z.enum(["csv", "json"]).default("json"),
				includePartial: z.boolean().default(false),
			}),
		)
		.handler(async ({ input, context }) => {
			await verifySurveyAccess(input.surveyId, context.activeOrganization.id);

			// Get survey with questions
			const [surveyData, questions] = await Promise.all([
				db.select().from(survey).where(eq(survey.id, input.surveyId)).limit(1),
				db
					.select()
					.from(question)
					.where(eq(question.surveyId, input.surveyId))
					.orderBy(question.order),
			]);

			if (!surveyData[0]) {
				throw new Error("Survey not found");
			}

			// Get responses with answers
			const conditions = [eq(response.surveyId, input.surveyId)];
			if (!input.includePartial) {
				conditions.push(eq(response.isComplete, true));
			}

			const responses = await db
				.select()
				.from(response)
				.where(and(...conditions))
				.orderBy(desc(response.createdAt));

			if (responses.length === 0) {
				return { data: [], format: input.format };
			}

			// Get all answers for these responses
			const responseIds = responses.map((r) => r.id);
			const answers = await db
				.select()
				.from(answer)
				.where(inArray(answer.responseId, responseIds));

			// Group answers by response
			const answersByResponse = new Map<string, Map<string, unknown>>();
			for (const a of answers) {
				if (!answersByResponse.has(a.responseId)) {
					answersByResponse.set(a.responseId, new Map());
				}
				answersByResponse.get(a.responseId)?.set(a.questionId, a.value);
			}

			if (input.format === "json") {
				const jsonData = responses.map((r) => {
					const responseAnswers = answersByResponse.get(r.id) || new Map();
					const answerObj: Record<string, unknown> = {};

					for (const q of questions) {
						answerObj[q.title] = responseAnswers.get(q.id) ?? null;
					}

					return {
						responseId: r.id,
						completedAt: r.completedAt?.toISOString() ?? null,
						isComplete: r.isComplete,
						metadata: r.metadata,
						answers: answerObj,
					};
				});

				return { data: jsonData, format: "json" as const };
			}

			// CSV format
			const headers = [
				"Response ID",
				"Completed At",
				"Status",
				...questions.map((q) => q.title),
			];

			const rows = responses.map((r) => {
				const responseAnswers = answersByResponse.get(r.id) || new Map();
				return [
					r.id,
					r.completedAt?.toISOString() ?? "",
					r.isComplete ? "Complete" : "Partial",
					...questions.map((q) => {
						const value = responseAnswers.get(q.id);
						if (value === null || value === undefined) return "";
						if (typeof value === "string")
							return `"${value.replace(/"/g, '""')}"`;
						return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
					}),
				];
			});

			const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join(
				"\n",
			);

			return { data: csv, format: "csv" as const };
		}),
};

// Helper function to calculate question analytics
async function calculateQuestionAnalytics(
	q: typeof question.$inferSelect,
): Promise<QuestionAnalytics> {
	// Get all answers for this question
	const answers = await db
		.select({ value: answer.value })
		.from(answer)
		.where(eq(answer.questionId, q.id));

	const distribution = new Map<string, number>();
	let numericSum = 0;
	let numericCount = 0;
	let numericMin: number | undefined;
	let numericMax: number | undefined;
	const textSamples: string[] = [];

	for (const a of answers) {
		const value = a.value;

		if (value === null || value === undefined) continue;

		if (typeof value === "string") {
			if (
				q.type === "text" ||
				q.type === "textarea" ||
				q.type === "email" ||
				q.type === "phone"
			) {
				// Text question - collect samples
				if (textSamples.length < 5) {
					textSamples.push(value);
				}
				// Also track as distribution for word frequency
				distribution.set(value, (distribution.get(value) || 0) + 1);
			} else {
				// Choice-based question
				distribution.set(value, (distribution.get(value) || 0) + 1);
			}
		} else if (typeof value === "number") {
			// Numeric question (rating, nps, linear_scale)
			const label = String(value);
			distribution.set(label, (distribution.get(label) || 0) + 1);
			numericSum += value;
			numericCount++;
			if (numericMin === undefined || value < numericMin) numericMin = value;
			if (numericMax === undefined || value > numericMax) numericMax = value;
		} else if (Array.isArray(value)) {
			// Multi-select (checkbox)
			for (const v of value) {
				const label = String(v);
				distribution.set(label, (distribution.get(label) || 0) + 1);
			}
		} else {
			// Unknown type - stringify
			const label = JSON.stringify(value);
			distribution.set(label, (distribution.get(label) || 0) + 1);
		}
	}

	const total = answers.length || 1;
	const sortedDistribution = Array.from(distribution.entries())
		.sort((a, b) => b[1] - a[1])
		.slice(0, 20)
		.map(([value, count]) => ({
			value,
			count,
			percentage: Math.round((count / total) * 100),
		}));

	const result: QuestionAnalytics = {
		questionId: q.id,
		questionType: q.type,
		questionTitle: q.title,
		totalAnswers: answers.length,
		distribution: sortedDistribution,
	};

	// Add numeric stats for rating/nps/linear_scale
	if (numericCount > 0) {
		result.average = Math.round((numericSum / numericCount) * 10) / 10;
		result.min = numericMin;
		result.max = numericMax;
	}

	// Add sample responses for text questions
	if (textSamples.length > 0) {
		result.sampleResponses = textSamples;
	}

	return result;
}
