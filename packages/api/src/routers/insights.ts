import { db } from "@orksys-survey/db";
import {
	aiAnalysis,
	type KeywordsAnalysis,
	type SentimentAnalysis,
	type TextSummaryAnalysis,
} from "@orksys-survey/db/schema/analytics";
import { answer, question, survey } from "@orksys-survey/db/schema/survey";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";

import { adminProcedure, organizationProcedure } from "../index";
import {
	analyzeSentiment,
	extractKeywords,
	generateTextSummary,
	isGroqConfigured,
} from "../services/llm";

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

// AI Analysis TTL (24 hours)
const AI_ANALYSIS_TTL = 24 * 60 * 60 * 1000;

// Generate unique IDs
function generateAnalysisId(): string {
	return `ai_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// Get cached AI analysis
async function getCachedAnalysis<T>(
	surveyId: string,
	type: string,
	questionId?: string,
): Promise<T | null> {
	const conditions = [
		eq(aiAnalysis.surveyId, surveyId),
		eq(aiAnalysis.type, type as "text_summary" | "sentiment" | "keywords"),
	];

	if (questionId) {
		conditions.push(eq(aiAnalysis.questionId, questionId));
	}

	const result = await db
		.select()
		.from(aiAnalysis)
		.where(and(...conditions))
		.limit(1);

	if (!result[0] || new Date() > result[0].expiresAt) {
		return null;
	}

	return result[0].data as T;
}

// Save AI analysis to cache
async function saveAnalysis(
	surveyId: string,
	type: string,
	data: unknown,
	modelUsed: string,
	tokensUsed: number,
	questionId?: string,
): Promise<void> {
	const expiresAt = new Date(Date.now() + AI_ANALYSIS_TTL);

	await db.insert(aiAnalysis).values({
		id: generateAnalysisId(),
		surveyId,
		questionId: questionId ?? null,
		type: type as "text_summary" | "sentiment" | "keywords",
		data,
		modelUsed,
		tokensUsed,
		expiresAt,
	});
}

// Get text responses for a question
async function getTextResponses(
	surveyId: string,
	questionId?: string,
): Promise<string[]> {
	// If questionId provided, get responses for that question
	if (questionId) {
		const targetQuestion = await db
			.select()
			.from(question)
			.where(eq(question.id, questionId))
			.limit(1);

		if (!targetQuestion[0]) {
			throw new Error("Question not found");
		}

		// Only process text-type questions
		const textTypes = ["text", "textarea", "email"];
		if (!textTypes.includes(targetQuestion[0].type)) {
			throw new Error("Question is not a text-type question");
		}

		const answers = await db
			.select({ value: answer.value })
			.from(answer)
			.where(eq(answer.questionId, questionId));

		return answers
			.map((a) => (typeof a.value === "string" ? a.value : null))
			.filter((v): v is string => v !== null && v.trim().length > 0);
	}

	// Get all text responses from the survey
	const questions = await db
		.select()
		.from(question)
		.where(eq(question.surveyId, surveyId));

	const textQuestionIds = questions
		.filter((q) => ["text", "textarea", "email"].includes(q.type))
		.map((q) => q.id);

	if (textQuestionIds.length === 0) {
		return [];
	}

	const answers = await db
		.select({ value: answer.value })
		.from(answer)
		.where(inArray(answer.questionId, textQuestionIds));

	return answers
		.map((a) => (typeof a.value === "string" ? a.value : null))
		.filter((v): v is string => v !== null && v.trim().length > 0);
}

export const insightsRouter = {
	// Get AI-generated text summary
	getTextSummary: organizationProcedure
		.input(
			z.object({
				surveyId: z.string(),
				questionId: z.string().optional(),
			}),
		)
		.handler(async ({ input, context }) => {
			await verifySurveyAccess(input.surveyId, context.activeOrganization.id);

			// Check if Groq is configured
			if (!isGroqConfigured()) {
				return {
					bullets: [
						"AI analysis is not configured. Please add GROQ_API_KEY to your environment.",
					],
					totalResponses: 0,
				} as TextSummaryAnalysis;
			}

			// Check cache
			const cached = await getCachedAnalysis<TextSummaryAnalysis>(
				input.surveyId,
				"text_summary",
				input.questionId,
			);
			if (cached) return cached;

			// Get text responses
			const responses = await getTextResponses(
				input.surveyId,
				input.questionId,
			);

			if (responses.length === 0) {
				return {
					bullets: ["No text responses to analyze"],
					totalResponses: 0,
				} as TextSummaryAnalysis;
			}

			// Generate summary
			const { data, tokensUsed } = await generateTextSummary(responses);

			const result: TextSummaryAnalysis = {
				bullets: data.bullets,
				totalResponses: responses.length,
			};

			// Save to cache
			await saveAnalysis(
				input.surveyId,
				"text_summary",
				result,
				"groq",
				tokensUsed,
				input.questionId,
			);

			return result;
		}),

	// Get sentiment analysis
	getSentimentAnalysis: organizationProcedure
		.input(
			z.object({
				surveyId: z.string(),
				questionId: z.string().optional(),
			}),
		)
		.handler(async ({ input, context }) => {
			await verifySurveyAccess(input.surveyId, context.activeOrganization.id);

			// Check if Groq is configured
			if (!isGroqConfigured()) {
				return {
					positive: 0,
					neutral: 100,
					negative: 0,
					totalResponses: 0,
				} as SentimentAnalysis;
			}

			// Check cache
			const cached = await getCachedAnalysis<SentimentAnalysis>(
				input.surveyId,
				"sentiment",
				input.questionId,
			);
			if (cached) return cached;

			// Get text responses
			const responses = await getTextResponses(
				input.surveyId,
				input.questionId,
			);

			if (responses.length === 0) {
				return {
					positive: 0,
					neutral: 100,
					negative: 0,
					totalResponses: 0,
				} as SentimentAnalysis;
			}

			// Analyze sentiment
			const { data, tokensUsed } = await analyzeSentiment(responses);

			const result: SentimentAnalysis = {
				...data,
				totalResponses: responses.length,
			};

			// Save to cache
			await saveAnalysis(
				input.surveyId,
				"sentiment",
				result,
				"groq",
				tokensUsed,
				input.questionId,
			);

			return result;
		}),

	// Get keyword extraction
	getKeywords: organizationProcedure
		.input(
			z.object({
				surveyId: z.string(),
				questionId: z.string().optional(),
			}),
		)
		.handler(async ({ input, context }) => {
			await verifySurveyAccess(input.surveyId, context.activeOrganization.id);

			// Check if Groq is configured
			if (!isGroqConfigured()) {
				return {
					keywords: [],
					totalResponses: 0,
				} as KeywordsAnalysis;
			}

			// Check cache
			const cached = await getCachedAnalysis<KeywordsAnalysis>(
				input.surveyId,
				"keywords",
				input.questionId,
			);
			if (cached) return cached;

			// Get text responses
			const responses = await getTextResponses(
				input.surveyId,
				input.questionId,
			);

			if (responses.length === 0) {
				return {
					keywords: [],
					totalResponses: 0,
				} as KeywordsAnalysis;
			}

			// Extract keywords
			const { data, tokensUsed } = await extractKeywords(responses);

			const result: KeywordsAnalysis = {
				keywords: data.keywords,
				totalResponses: responses.length,
			};

			// Save to cache
			await saveAnalysis(
				input.surveyId,
				"keywords",
				result,
				"groq",
				tokensUsed,
				input.questionId,
			);

			return result;
		}),

	// Force re-analysis (admin only)
	refreshAnalysis: adminProcedure
		.input(
			z.object({
				surveyId: z.string(),
				type: z.enum(["text_summary", "sentiment", "keywords", "all"]),
				questionId: z.string().optional(),
			}),
		)
		.handler(async ({ input, context }) => {
			await verifySurveyAccess(input.surveyId, context.activeOrganization.id);

			// Delete cached analysis
			const conditions = [eq(aiAnalysis.surveyId, input.surveyId)];

			if (input.questionId) {
				conditions.push(eq(aiAnalysis.questionId, input.questionId));
			}

			if (input.type !== "all") {
				conditions.push(eq(aiAnalysis.type, input.type));
			}

			await db.delete(aiAnalysis).where(and(...conditions));

			return { success: true, message: "Analysis cache cleared" };
		}),

	// Check if AI insights are available
	getStatus: organizationProcedure
		.input(z.object({ surveyId: z.string() }))
		.handler(async ({ input, context }) => {
			await verifySurveyAccess(input.surveyId, context.activeOrganization.id);

			return {
				available: isGroqConfigured(),
				message: isGroqConfigured()
					? "AI insights are available"
					: "AI insights require GROQ_API_KEY configuration",
			};
		}),
};
