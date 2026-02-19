import { db } from "@orksys-survey/db";
import {
	answer,
	question,
	response,
	survey,
} from "@orksys-survey/db/schema/survey";
import { and, count, eq, gte, inArray, sql } from "drizzle-orm";
import { z } from "zod";

import { organizationProcedure } from "../index";

// Time range helper
function getDateRange(days: number | undefined): Date | undefined {
	if (!days || days === 0) return undefined;
	const date = new Date();
	date.setDate(date.getDate() - days);
	date.setHours(0, 0, 0, 0);
	return date;
}

// Dashboard Summary Data
export interface DashboardSummary {
	totalSurveys: number;
	totalResponses: number;
	completeResponses: number;
	partialResponses: number;
	avgCompletionRate: number;
	activeThisMonth: number;
	previousMonthResponses: number;
	responseTrend: "up" | "down" | "neutral";
}

// NPS Data
export interface DashboardNPS {
	score: number;
	promoters: number;
	passives: number;
	detractors: number;
	totalResponses: number;
	distribution: {
		promoters: number;
		passives: number;
		detractors: number;
	};
}

// Rating Data (CSAT/CES)
export interface RatingQuestion {
	questionId: string;
	questionTitle: string;
	surveyTitle: string;
	questionType: string;
	average: number;
	count: number;
}

export interface DashboardRatings {
	csat: RatingQuestion[];
	ces: RatingQuestion[];
	rating: RatingQuestion[];
}

// Trend Data Point
export interface TrendDataPoint extends Record<string, unknown> {
	date: string;
	responses: number;
	complete: number;
}

// Funnel Data
export interface DashboardFunnel {
	views: number;
	started: number;
	partial: number;
	complete: number;
	viewToStarted: number;
	startedToComplete: number;
}

// Demographics Data
export interface DemographicBreakdown {
	name: string;
	count: number;
	percentage: number;
}

export interface DashboardDemographics {
	browsers: DemographicBreakdown[];
	devices: DemographicBreakdown[];
	os: DemographicBreakdown[];
	countries: DemographicBreakdown[];
}

export const dashboardRouter = {
	// Get aggregated summary across all surveys in organization
	getSummary: organizationProcedure
		.input(
			z.object({
				days: z.number().int().min(1).max(365).optional(),
				surveyIds: z.array(z.string()).optional(),
			}),
		)
		.handler(async ({ input, context }) => {
			const startDate = getDateRange(input.days);

			// Base conditions for organization filtering
			const orgConditions = [
				eq(survey.organizationId, context.activeOrganization.id),
			];

			// Add survey filter if provided
			if (input.surveyIds && input.surveyIds.length > 0) {
				orgConditions.push(sql`${survey.id} = ANY(${input.surveyIds})`);
			}

			// Get total surveys
			const surveyCountResult = await db
				.select({ count: count() })
				.from(survey)
				.where(and(...orgConditions));

			// Build response conditions
			const responseConditions = [
				sql`EXISTS (
			SELECT 1 FROM survey s WHERE s.id = response.survey_id
			AND s.organization_id = ${context.activeOrganization.id}
		)`,
			];

			// Add date filter if specified
			if (startDate) {
				responseConditions.push(gte(response.createdAt, startDate));
			}

			// Add survey filter if provided
			if (input.surveyIds && input.surveyIds.length > 0) {
				responseConditions.push(
					sql`${response.surveyId} = ANY(${input.surveyIds})`,
				);
			}

			// Get response stats
			const [totalResult, completeResult] = await Promise.all([
				db
					.select({ count: count() })
					.from(response)
					.where(and(...responseConditions)),
				db
					.select({ count: count() })
					.from(response)
					.where(and(...responseConditions, eq(response.isComplete, true))),
			]);

			const total = totalResult[0]?.count ?? 0;
			const complete = completeResult[0]?.count ?? 0;
			const partial = total - complete;

			// Get active surveys this month
			const thisMonth = new Date();
			thisMonth.setDate(1);
			thisMonth.setHours(0, 0, 0, 0);

			const activeResult = await db
				.select({ count: count() })
				.from(survey)
				.where(and(...orgConditions, gte(survey.createdAt, thisMonth)));

			// Get previous month responses for trend comparison
			const prevMonthStart = new Date();
			prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);
			prevMonthStart.setDate(1);
			prevMonthStart.setHours(0, 0, 0, 0);

			const prevMonthEnd = new Date();
			prevMonthEnd.setDate(1);
			prevMonthEnd.setHours(0, 0, 0, 0);

			const prevMonthResult = await db
				.select({ count: count() })
				.from(response)
				.where(
					and(
						sql`EXISTS (
					SELECT 1 FROM survey s WHERE s.id = response.survey_id
					AND s.organization_id = ${context.activeOrganization.id}
				)`,
						gte(response.createdAt, prevMonthStart),
						sql`${response.createdAt} < ${prevMonthEnd}`,
					),
				);

			const prevMonthResponses = prevMonthResult[0]?.count ?? 0;
			const thisMonthResponses = total;

			// Determine trend
			let responseTrend: "up" | "down" | "neutral" = "neutral";
			if (thisMonthResponses > prevMonthResponses * 1.05) {
				responseTrend = "up";
			} else if (thisMonthResponses < prevMonthResponses * 0.95) {
				responseTrend = "down";
			}

			const result: DashboardSummary = {
				totalSurveys: surveyCountResult[0]?.count ?? 0,
				totalResponses: total,
				completeResponses: complete,
				partialResponses: partial,
				avgCompletionRate: total > 0 ? Math.round((complete / total) * 100) : 0,
				activeThisMonth: activeResult[0]?.count ?? 0,
				previousMonthResponses: prevMonthResponses,
				responseTrend,
			};

			return result;
		}),

	// Get NPS across all NPS questions in all surveys
	getNPS: organizationProcedure
		.input(
			z.object({
				days: z.number().int().min(1).max(365).optional(),
				surveyIds: z.array(z.string()).optional(),
			}),
		)
		.handler(async ({ input, context }) => {
			const startDate = getDateRange(input.days);

			// Get all NPS questions in the organization
			const questionConditions = [
				sql`EXISTS (
			SELECT 1 FROM survey s WHERE s.id = question.survey_id
			AND s.organization_id = ${context.activeOrganization.id}
		)`,
			];

			if (input.surveyIds && input.surveyIds.length > 0) {
				questionConditions.push(
					sql`${question.surveyId} = ANY(${input.surveyIds})`,
				);
			}

			const npsQuestions = await db
				.select({
					questionId: question.id,
					questionTitle: question.title,
					surveyId: survey.id,
					surveyTitle: survey.title,
				})
				.from(question)
				.innerJoin(survey, eq(question.surveyId, survey.id))
				.where(and(...questionConditions, eq(question.type, "nps")));

			if (npsQuestions.length === 0) {
				return {
					score: 0,
					promoters: 0,
					passives: 0,
					detractors: 0,
					totalResponses: 0,
					distribution: { promoters: 0, passives: 0, detractors: 0 },
				};
			}

			const questionIds = npsQuestions.map((q) => q.questionId);

			// Get all NPS answers
			const answerConditions = [inArray(answer.questionId, questionIds)];

			if (startDate) {
				answerConditions.push(
					sql`EXISTS (
				SELECT 1 FROM response r WHERE r.id = answer.response_id
				AND r.created_at >= ${startDate}
			)`,
				);
			}

			const npsAnswers = await db
				.select({ value: answer.value })
				.from(answer)
				.where(and(...answerConditions));

			// Calculate NPS
			let promoters = 0;
			let passives = 0;
			let detractors = 0;

			for (const a of npsAnswers) {
				const value = typeof a.value === "number" ? a.value : 0;
				if (value >= 9) promoters++;
				else if (value >= 7) passives++;
				else detractors++;
			}

			const total = npsAnswers.length || 1;
			const score = Math.round(((promoters - detractors) / total) * 100);

			const result: DashboardNPS = {
				score,
				promoters,
				passives,
				detractors,
				totalResponses: npsAnswers.length,
				distribution: {
					promoters: Math.round((promoters / total) * 100),
					passives: Math.round((passives / total) * 100),
					detractors: Math.round((detractors / total) * 100),
				},
			};

			return result;
		}),

	// Get CSAT/CES ratings across all surveys
	getRatings: organizationProcedure
		.input(
			z.object({
				days: z.number().int().min(1).max(365).optional(),
				surveyIds: z.array(z.string()).optional(),
			}),
		)
		.handler(async ({ input, context }) => {
			const startDate = getDateRange(input.days);

			// Get all rating-type questions
			const questionConditions = [
				sql`EXISTS (
			SELECT 1 FROM survey s WHERE s.id = question.survey_id
			AND s.organization_id = ${context.activeOrganization.id}
		)`,
				inArray(question.type, ["rating", "linear_scale"]),
			];

			if (input.surveyIds && input.surveyIds.length > 0) {
				questionConditions.push(
					sql`${question.surveyId} = ANY(${input.surveyIds})`,
				);
			}

			const ratingQuestions = await db
				.select({
					questionId: question.id,
					questionTitle: question.title,
					surveyId: survey.id,
					surveyTitle: survey.title,
					questionType: question.type,
				})
				.from(question)
				.innerJoin(survey, eq(question.surveyId, survey.id))
				.where(and(...questionConditions));

			const results: DashboardRatings = {
				csat: [],
				ces: [],
				rating: [],
			};

			// For each question, get average rating
			for (const q of ratingQuestions) {
				const answerConditions = [eq(answer.questionId, q.questionId)];

				if (startDate) {
					answerConditions.push(
						sql`EXISTS (
					SELECT 1 FROM response r WHERE r.id = answer.response_id
					AND r.created_at >= ${startDate}
				)`,
					);
				}

				const answers = await db
					.select({ value: answer.value })
					.from(answer)
					.where(and(...answerConditions));

				const numericAnswers = answers
					.map((a) => (typeof a.value === "number" ? a.value : null))
					.filter((v): v is number => v !== null);

				if (numericAnswers.length === 0) continue;

				const sum = numericAnswers.reduce((a, b) => a + b, 0);
				const average = Math.round((sum / numericAnswers.length) * 10) / 10;

				const ratingData: RatingQuestion = {
					questionId: q.questionId,
					questionTitle: q.questionTitle,
					surveyTitle: q.surveyTitle,
					questionType: q.questionType,
					average,
					count: numericAnswers.length,
				};

				// Categorize by config (CSAT typically 1-5, CES typically 1-7)
				// For now, put all in "rating" category - UI can separate
				results.rating.push(ratingData);
			}

			return results;
		}),

	// Get response trends over time (all surveys)
	getTrends: organizationProcedure
		.input(
			z.object({
				days: z.number().int().min(1).max(365).default(30),
				surveyIds: z.array(z.string()).optional(),
			}),
		)
		.handler(async ({ input, context }) => {
			const startDate = getDateRange(input.days) ?? new Date();
			startDate.setHours(0, 0, 0, 0);

			// Build conditions
			const conditions = [
				sql`EXISTS (
			SELECT 1 FROM survey s WHERE s.id = response.survey_id
			AND s.organization_id = ${context.activeOrganization.id}
		)`,
				gte(response.createdAt, startDate),
			];

			if (input.surveyIds && input.surveyIds.length > 0) {
				conditions.push(sql`${response.surveyId} = ANY(${input.surveyIds})`);
			}

			// Get all responses in date range
			const responses = await db
				.select({
					createdAt: response.createdAt,
					isComplete: response.isComplete,
				})
				.from(response)
				.where(and(...conditions))
				.orderBy(response.createdAt);

			// Group by date
			const dateMap = new Map<
				string,
				{ responses: number; complete: number }
			>();

			for (const r of responses) {
				const dateKey = r.createdAt.toISOString().split("T")[0] ?? "";
				const existing = dateMap.get(dateKey) || {
					responses: 0,
					complete: 0,
				};
				existing.responses++;
				if (r.isComplete) existing.complete++;
				dateMap.set(dateKey, existing);
			}

			// Fill in missing dates
			const trends: TrendDataPoint[] = [];
			const currentDate = new Date(startDate);
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			while (currentDate <= today) {
				const dateKey = currentDate.toISOString().split("T")[0] ?? "";
				const data = dateMap.get(dateKey) || { responses: 0, complete: 0 };
				trends.push({
					date: dateKey,
					responses: data.responses,
					complete: data.complete,
				});
				currentDate.setDate(currentDate.getDate() + 1);
			}

			return trends;
		}),

	// Get aggregated demographics
	getDemographics: organizationProcedure
		.input(
			z.object({
				days: z.number().int().min(1).max(365).optional(),
				surveyIds: z.array(z.string()).optional(),
			}),
		)
		.handler(async ({ input, context }) => {
			const startDate = getDateRange(input.days);

			// Build conditions
			const conditions = [
				sql`EXISTS (
			SELECT 1 FROM survey s WHERE s.id = response.survey_id
			AND s.organization_id = ${context.activeOrganization.id}
		)`,
			];

			if (startDate) {
				conditions.push(gte(response.createdAt, startDate));
			}

			if (input.surveyIds && input.surveyIds.length > 0) {
				conditions.push(sql`${response.surveyId} = ANY(${input.surveyIds})`);
			}

			// Get all responses with metadata
			const responses = await db
				.select({ metadata: response.metadata })
				.from(response)
				.where(and(...conditions));

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

			const result: DashboardDemographics = {
				browsers: toSortedArray(browsers),
				devices: toSortedArray(devices),
				os: toSortedArray(os),
				countries: toSortedArray(countries),
			};

			return result;
		}),

	// Get funnel analytics
	getFunnel: organizationProcedure
		.input(
			z.object({
				days: z.number().int().min(1).max(365).optional(),
				surveyIds: z.array(z.string()).optional(),
			}),
		)
		.handler(async ({ input, context }) => {
			const startDate = getDateRange(input.days);

			// Build conditions
			const conditions = [
				sql`EXISTS (
			SELECT 1 FROM survey s WHERE s.id = response.survey_id
			AND s.organization_id = ${context.activeOrganization.id}
		)`,
			];

			if (startDate) {
				conditions.push(gte(response.createdAt, startDate));
			}

			if (input.surveyIds && input.surveyIds.length > 0) {
				conditions.push(sql`${response.surveyId} = ANY(${input.surveyIds})`);
			}

			// Get funnel data
			const [allResponses, completeResponses] = await Promise.all([
				db
					.select()
					.from(response)
					.where(and(...conditions)),
				db
					.select()
					.from(response)
					.where(and(...conditions, eq(response.isComplete, true))),
			]);

			// Count answers to determine "started" (at least one answer)
			const responseIds = allResponses.map((r) => r.id);
			const startedResponseIds =
				responseIds.length > 0
					? (
							await db
								.select({ responseId: answer.responseId })
								.from(answer)
								.where(inArray(answer.responseId, responseIds))
						).map((a) => a.responseId)
					: [];

			const startedSet = new Set(startedResponseIds);

			// Views is an estimate - we'll use total responses as a proxy
			// In a real implementation, you'd track page views separately
			const views = allResponses.length * 2; // Rough estimate

			const started = startedSet.size;
			const complete = completeResponses.length;
			const partial = started - complete;

			// Calculate conversion rates
			const viewToStarted = views > 0 ? Math.round((started / views) * 100) : 0;
			const startedToComplete =
				started > 0 ? Math.round((complete / started) * 100) : 0;

			const result: DashboardFunnel = {
				views,
				started,
				partial,
				complete,
				viewToStarted,
				startedToComplete,
			};

			return result;
		}),
};
