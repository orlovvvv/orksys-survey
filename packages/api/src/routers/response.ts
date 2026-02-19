import { db } from "@orksys-survey/db";
import { organization } from "@orksys-survey/db/schema/organization";
import {
	answer,
	logicRule,
	question,
	response,
	survey,
} from "@orksys-survey/db/schema/survey";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";

import {
	adminProcedure,
	organizationProcedure,
	publicProcedure,
} from "../index";

// Input schemas
const submitResponseSchema = z.object({
	surveyId: z.string(),
	fingerprint: z.string().optional(),
	respondentId: z.string().optional(),
	metadata: z
		.object({
			userAgent: z.string().optional(),
			referrer: z.string().optional(),
			browser: z.string().optional(),
			os: z.string().optional(),
			device: z.string().optional(),
			country: z.string().optional(),
			language: z.string().optional(),
			timezone: z.string().optional(),
		})
		.optional(),
	answers: z.array(
		z.object({
			questionId: z.string(),
			value: z.unknown(),
		}),
	),
	isComplete: z.boolean().default(false),
});

const saveProgressSchema = z.object({
	surveyId: z.string(),
	respondentId: z.string(),
	fingerprint: z.string().optional(),
	answers: z.array(
		z.object({
			questionId: z.string(),
			value: z.unknown(),
		}),
	),
	currentQuestionIndex: z.number().optional(),
	isComplete: z.boolean().default(false),
	metadata: z
		.object({
			userAgent: z.string().optional(),
			referrer: z.string().optional(),
			browser: z.string().optional(),
			os: z.string().optional(),
			device: z.string().optional(),
			country: z.string().optional(),
			language: z.string().optional(),
			timezone: z.string().optional(),
		})
		.optional(),
});

const responseListSchema = z.object({
	surveyId: z.string(),
	page: z.number().int().min(1).default(1),
	limit: z.number().int().min(1).max(100).default(20),
	isComplete: z.boolean().optional(),
});

// Generate unique IDs
function generateResponseId(): string {
	return `resp_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

function generateAnswerId(): string {
	return `ans_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

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

export const responseRouter = {
	// PUBLIC - Get published survey for runner
	getSurveyForRunner: publicProcedure
		.input(z.object({ orgSlug: z.string(), surveySlug: z.string() }))
		.handler(async ({ input }) => {
			const surveyResult = await db
				.select({
					survey: survey,
					organization: {
						id: organization.id,
						name: organization.name,
						slug: organization.slug,
						logo: organization.logo,
					},
				})
				.from(survey)
				.innerJoin(organization, eq(survey.organizationId, organization.id))
				.where(
					and(
						eq(survey.slug, input.surveySlug),
						eq(organization.slug, input.orgSlug),
						eq(survey.status, "published"),
					),
				)
				.limit(1);

			if (!surveyResult[0]) {
				throw new Error("Survey not found or not published");
			}

			const surveyData = surveyResult[0].survey;

			// Get questions and logic rules for the survey in parallel
			const [questions, logicRules] = await Promise.all([
				db
					.select()
					.from(question)
					.where(eq(question.surveyId, surveyData.id))
					.orderBy(question.order),
				db
					.select()
					.from(logicRule)
					.where(eq(logicRule.surveyId, surveyData.id)),
			]);

			return {
				survey: {
					...surveyData,
					organization: surveyResult[0].organization,
				},
				questions,
				logicRules,
			};
		}),

	// PUBLIC - Submit response
	submit: publicProcedure
		.input(submitResponseSchema)
		.handler(async ({ input }) => {
			// Verify survey exists and is published
			const surveyResult = await db
				.select()
				.from(survey)
				.where(
					and(eq(survey.id, input.surveyId), eq(survey.status, "published")),
				)
				.limit(1);

			if (!surveyResult[0]) {
				throw new Error("Survey not found or not published");
			}

			// Check for duplicate fingerprint if provided and multiple responses NOT allowed
			if (
				input.fingerprint &&
				!surveyResult[0].settings?.allowMultipleResponses
			) {
				const existingResponse = await db
					.select()
					.from(response)
					.where(
						and(
							eq(response.surveyId, input.surveyId),
							eq(response.fingerprint, input.fingerprint),
						),
					)
					.limit(1);

				if (existingResponse[0]) {
					throw new Error("You have already responded to this survey");
				}
			}

			// Verify all questions belong to this survey
			const questionIds = input.answers.map((a) => a.questionId);
			if (questionIds.length > 0) {
				const questions = await db
					.select()
					.from(question)
					.where(inArray(question.id, questionIds));

				for (const q of questions) {
					if (q.surveyId !== input.surveyId) {
						throw new Error(`Question ${q.id} does not belong to this survey`);
					}
				}
			}

			// Create response and answers in a transaction
			const responseId = generateResponseId();
			const now = new Date();

			await db.insert(response).values({
				id: responseId,
				surveyId: input.surveyId,
				respondentId: input.respondentId ?? null,
				fingerprint: input.fingerprint ?? null,
				metadata: input.metadata ?? null,
				isComplete: input.isComplete,
				startedAt: now,
				completedAt: input.isComplete ? now : null,
			});

			// Insert answers
			if (input.answers.length > 0) {
				const answersToInsert = input.answers.map((a) => ({
					id: generateAnswerId(),
					responseId,
					questionId: a.questionId,
					value: a.value,
				}));

				await db.insert(answer).values(answersToInsert);
			}

			return { success: true, responseId };
		}),

	// PUBLIC - Get existing incomplete response by respondentId
	getExistingResponse: publicProcedure
		.input(
			z.object({
				surveyId: z.string(),
				respondentId: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			const existingResponse = await db
				.select()
				.from(response)
				.where(
					and(
						eq(response.surveyId, input.surveyId),
						eq(response.respondentId, input.respondentId),
						eq(response.isComplete, false),
					),
				)
				.limit(1);

			if (!existingResponse[0]) {
				return null;
			}

			// Get the answers for this response
			const answers = await db
				.select()
				.from(answer)
				.where(eq(answer.responseId, existingResponse[0].id));

			return {
				response: existingResponse[0],
				answers: answers.map((a) => ({
					questionId: a.questionId,
					value: a.value,
				})),
			};
		}),

	// PUBLIC - Save or update progress
	saveProgress: publicProcedure
		.input(saveProgressSchema)
		.handler(async ({ input }) => {
			// Verify survey exists and is published
			const surveyResult = await db
				.select()
				.from(survey)
				.where(
					and(eq(survey.id, input.surveyId), eq(survey.status, "published")),
				)
				.limit(1);

			if (!surveyResult[0]) {
				throw new Error("Survey not found or not published");
			}

			// Check for existing incomplete response by respondentId
			const existingResponse = await db
				.select()
				.from(response)
				.where(
					and(
						eq(response.surveyId, input.surveyId),
						eq(response.respondentId, input.respondentId),
						eq(response.isComplete, false),
					),
				)
				.limit(1);

			const now = new Date();

			if (existingResponse[0]) {
				// Update existing response
				const responseId = existingResponse[0].id;

				await db
					.update(response)
					.set({
						metadata: input.metadata ?? null,
						isComplete: input.isComplete,
						completedAt: input.isComplete ? now : null,
						updatedAt: now,
					})
					.where(eq(response.id, responseId));

				// Delete existing answers and insert new ones
				await db.delete(answer).where(eq(answer.responseId, responseId));

				if (input.answers.length > 0) {
					const answersToInsert = input.answers.map((a) => ({
						id: generateAnswerId(),
						responseId,
						questionId: a.questionId,
						value: a.value,
					}));

					await db.insert(answer).values(answersToInsert);
				}

				return { success: true, responseId };
			}

			// Create new response
			const responseId = generateResponseId();

			await db.insert(response).values({
				id: responseId,
				surveyId: input.surveyId,
				respondentId: input.respondentId,
				fingerprint: input.fingerprint ?? null,
				metadata: input.metadata ?? null,
				isComplete: input.isComplete,
				startedAt: now,
				completedAt: input.isComplete ? now : null,
			});

			// Insert answers
			if (input.answers.length > 0) {
				const answersToInsert = input.answers.map((a) => ({
					id: generateAnswerId(),
					responseId,
					questionId: a.questionId,
					value: a.value,
				}));

				await db.insert(answer).values(answersToInsert);
			}

			return { success: true, responseId };
		}),

	// PROTECTED - List responses for a survey
	list: organizationProcedure
		.input(responseListSchema)
		.handler(async ({ input, context }) => {
			await verifySurveyAccess(input.surveyId, context.activeOrganization.id);

			const { page, limit, surveyId, isComplete } = input;
			const offset = (page - 1) * limit;

			const conditions = [eq(response.surveyId, surveyId)];
			if (isComplete !== undefined) {
				conditions.push(eq(response.isComplete, isComplete));
			}

			const [responses, totalResult] = await Promise.all([
				db
					.select()
					.from(response)
					.where(and(...conditions))
					.orderBy(desc(response.createdAt))
					.limit(limit)
					.offset(offset),
				db
					.select({ count: count() })
					.from(response)
					.where(and(...conditions)),
			]);

			return {
				data: responses,
				pagination: {
					page,
					limit,
					total: totalResult[0]?.count ?? 0,
					totalPages: Math.ceil((totalResult[0]?.count ?? 0) / limit),
				},
			};
		}),

	// PROTECTED - Get single response with answers
	getById: organizationProcedure
		.input(z.object({ id: z.string() }))
		.handler(async ({ input, context }) => {
			const result = await db
				.select()
				.from(response)
				.where(eq(response.id, input.id))
				.limit(1);

			if (!result[0]) {
				throw new Error("Response not found");
			}

			// Verify survey access
			await verifySurveyAccess(
				result[0].surveyId,
				context.activeOrganization.id,
			);

			// Get answers - we'd need an answer table query here
			// For now, return the response without answers
			return result[0];
		}),

	// PROTECTED - Get response stats for a survey
	getStats: organizationProcedure
		.input(z.object({ surveyId: z.string() }))
		.handler(async ({ input, context }) => {
			await verifySurveyAccess(input.surveyId, context.activeOrganization.id);

			const [totalResult, completeResult, partialResult] = await Promise.all([
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
					.select({ count: count() })
					.from(response)
					.where(
						and(
							eq(response.surveyId, input.surveyId),
							eq(response.isComplete, false),
						),
					),
			]);

			return {
				total: totalResult[0]?.count ?? 0,
				complete: completeResult[0]?.count ?? 0,
				partial: partialResult[0]?.count ?? 0,
			};
		}),

	// PROTECTED - Delete single response
	delete: adminProcedure
		.input(z.object({ id: z.string() }))
		.handler(async ({ input, context }) => {
			const result = await db
				.select()
				.from(response)
				.where(eq(response.id, input.id))
				.limit(1);

			if (!result[0]) {
				throw new Error("Response not found");
			}

			await verifySurveyAccess(
				result[0].surveyId,
				context.activeOrganization.id,
			);

			await db.delete(response).where(eq(response.id, input.id));
			return { success: true };
		}),

	// PROTECTED - Bulk delete responses
	bulkDelete: adminProcedure
		.input(z.object({ ids: z.array(z.string()) }))
		.handler(async ({ input, context }) => {
			if (input.ids.length === 0) {
				return { success: true, deletedCount: 0 };
			}

			const responses = await db
				.select()
				.from(response)
				.where(inArray(response.id, input.ids));

			if (responses.length !== input.ids.length) {
				throw new Error("Some responses not found");
			}

			// Verify survey access for first response
			const firstResponse = responses[0];
			if (!firstResponse) {
				throw new Error("No responses found");
			}
			await verifySurveyAccess(
				firstResponse.surveyId,
				context.activeOrganization.id,
			);

			await db.delete(response).where(inArray(response.id, input.ids));

			return { success: true, deletedCount: responses.length };
		}),
};
