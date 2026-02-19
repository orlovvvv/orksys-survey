import { db } from "@orksys-survey/db";
import { question, survey } from "@orksys-survey/db/schema/survey";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, organizationProcedure } from "../index";
import { getDefaultConfigForQuestionType } from "../lib/question-defaults";

// Input schemas
const questionConfigSchema = z.object({
	placeholder: z.string().optional(),
	minLength: z.number().int().min(0).optional(),
	maxLength: z.number().int().min(1).optional(),
	options: z
		.array(
			z.object({
				label: z.string(),
				value: z.string(),
			}),
		)
		.optional(),
	min: z.number().optional(),
	max: z.number().optional(),
	step: z.number().optional(),
	allowOther: z.boolean().optional(),
	allowMultiple: z.boolean().optional(),
	maxFiles: z.number().int().min(1).optional(),
	maxFileSize: z.number().int().min(1).optional(),
	acceptedFileTypes: z.array(z.string()).optional(),
});

const questionCreateSchema = z.object({
	surveyId: z.string(),
	type: z.enum([
		"text",
		"textarea",
		"multiple_choice",
		"checkbox",
		"dropdown",
		"rating",
		"nps",
		"linear_scale",
		"date",
		"email",
		"phone",
		"file_upload",
	]),
	title: z.string().min(1).max(500),
	description: z.string().max(2000).optional(),
	config: questionConfigSchema.optional(),
	required: z.boolean().default(false),
	order: z.number().int().min(0).default(0),
});

const questionUpdateSchema = questionCreateSchema
	.partial()
	.omit({ surveyId: true });

const reorderSchema = z.object({
	questions: z.array(
		z.object({
			id: z.string(),
			order: z.number().int().min(0),
		}),
	),
});

// Generate unique ID
function generateId(): string {
	return `q_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
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

export const questionRouter = {
	// List questions for a survey
	list: organizationProcedure
		.input(z.object({ surveyId: z.string() }))
		.handler(async ({ input, context }) => {
			await verifySurveyAccess(input.surveyId, context.activeOrganization.id);

			const questions = await db
				.select()
				.from(question)
				.where(eq(question.surveyId, input.surveyId))
				.orderBy(question.order);

			return questions;
		}),

	// Create question
	create: adminProcedure
		.input(questionCreateSchema)
		.handler(async ({ input, context }) => {
			await verifySurveyAccess(input.surveyId, context.activeOrganization.id);

			const id = generateId();
			await db.insert(question).values({
				id,
				surveyId: input.surveyId,
				type: input.type,
				title: input.title,
				description: input.description ?? null,
				config: input.config ?? getDefaultConfigForQuestionType(input.type),
				required: input.required,
				order: input.order,
			});

			const result = await db
				.select()
				.from(question)
				.where(eq(question.id, id))
				.limit(1);
			return result[0];
		}),

	// Update question
	update: adminProcedure
		.input(z.object({ id: z.string(), data: questionUpdateSchema }))
		.handler(async ({ input, context }) => {
			// Get question and verify survey access
			const existing = await db
				.select()
				.from(question)
				.where(eq(question.id, input.id))
				.limit(1);

			if (!existing[0]) {
				throw new Error("Question not found");
			}

			await verifySurveyAccess(
				existing[0].surveyId,
				context.activeOrganization.id,
			);

			await db
				.update(question)
				.set({
					...(input.data.type && { type: input.data.type }),
					...(input.data.title !== undefined && { title: input.data.title }),
					...(input.data.description !== undefined && {
						description: input.data.description ?? null,
					}),
					...(input.data.config !== undefined && {
						config: input.data.config ?? null,
					}),
					...(input.data.required !== undefined && {
						required: input.data.required,
					}),
					...(input.data.order !== undefined && { order: input.data.order }),
				})
				.where(eq(question.id, input.id));

			const result = await db
				.select()
				.from(question)
				.where(eq(question.id, input.id))
				.limit(1);
			return result[0];
		}),

	// Delete question
	delete: adminProcedure
		.input(z.object({ id: z.string() }))
		.handler(async ({ input, context }) => {
			// Get question and verify survey access
			const existing = await db
				.select()
				.from(question)
				.where(eq(question.id, input.id))
				.limit(1);

			if (!existing[0]) {
				throw new Error("Question not found");
			}

			await verifySurveyAccess(
				existing[0].surveyId,
				context.activeOrganization.id,
			);

			await db.delete(question).where(eq(question.id, input.id));
			return { success: true };
		}),

	// Reorder questions
	reorder: adminProcedure
		.input(reorderSchema)
		.handler(async ({ input, context }) => {
			if (input.questions.length === 0) {
				return { success: true };
			}

			// Get all questions
			const questions = await db
				.select()
				.from(question)
				.where(
					inArray(
						question.id,
						input.questions.map((q) => q.id),
					),
				);

			if (questions.length !== input.questions.length) {
				throw new Error("Some questions not found");
			}

			// Verify all questions belong to same survey and organization has access
			const firstQuestion = questions[0];
			if (!firstQuestion) {
				throw new Error("No questions found");
			}
			const surveyId = firstQuestion.surveyId;
			for (const q of questions) {
				if (q.surveyId !== surveyId) {
					throw new Error("All questions must belong to the same survey");
				}
			}
			await verifySurveyAccess(surveyId, context.activeOrganization.id);

			// Update order for each question
			await Promise.all(
				input.questions.map((q) =>
					db
						.update(question)
						.set({ order: q.order })
						.where(eq(question.id, q.id)),
				),
			);

			return { success: true };
		}),

	// Bulk create questions
	bulkCreate: adminProcedure
		.input(
			z.object({
				surveyId: z.string(),
				questions: z.array(questionCreateSchema.omit({ surveyId: true })),
			}),
		)
		.handler(async ({ input, context }) => {
			await verifySurveyAccess(input.surveyId, context.activeOrganization.id);

			const questionsToCreate = input.questions.map((q, index) => ({
				id: generateId(),
				surveyId: input.surveyId,
				type: q.type,
				title: q.title,
				description: q.description ?? null,
				config: q.config ?? getDefaultConfigForQuestionType(q.type),
				required: q.required ?? false,
				order: q.order ?? index,
			}));

			await db.insert(question).values(questionsToCreate);

			return { success: true, createdCount: questionsToCreate.length };
		}),

	// Bulk delete questions
	bulkDelete: adminProcedure
		.input(z.object({ ids: z.array(z.string()) }))
		.handler(async ({ input, context }) => {
			if (input.ids.length === 0) {
				return { success: true, deletedCount: 0 };
			}

			// Get all questions
			const questions = await db
				.select()
				.from(question)
				.where(inArray(question.id, input.ids));

			if (questions.length !== input.ids.length) {
				throw new Error("Some questions not found");
			}

			// Verify survey access
			const firstQuestion = questions[0];
			if (!firstQuestion) {
				throw new Error("No questions found");
			}
			await verifySurveyAccess(
				firstQuestion.surveyId,
				context.activeOrganization.id,
			);

			await db.delete(question).where(inArray(question.id, input.ids));

			return { success: true, deletedCount: questions.length };
		}),
};
