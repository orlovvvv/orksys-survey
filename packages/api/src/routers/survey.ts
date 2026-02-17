import { db } from "@orksys-survey/db";
import { survey } from "@orksys-survey/db/schema/survey";
import { and, count, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { z } from "zod";

import {
	adminProcedure,
	organizationProcedure,
	ownerProcedure,
	publicProcedure,
} from "../index";

// Input schemas
const surveyCreateSchema = z.object({
	slug: z
		.string()
		.min(1)
		.max(100)
		.regex(/^[a-z0-9-]+$/),
	title: z.string().min(1).max(255),
	description: z.string().max(2000).optional(),
	settings: z
		.object({
			showProgressBar: z.boolean().optional(),
			showQuestionNumbers: z.boolean().optional(),
			shuffleQuestions: z.boolean().optional(),
			allowMultipleResponses: z.boolean().optional(),
			requireAuth: z.boolean().optional(),
			collectMetadata: z.boolean().optional(),
			thankYouMessage: z.string().optional(),
			redirectUrl: z.string().url().optional(),
			theme: z
				.object({
					primaryColor: z.string().optional(),
					backgroundColor: z.string().optional(),
					fontFamily: z.string().optional(),
				})
				.optional(),
		})
		.optional(),
});

const surveyUpdateSchema = surveyCreateSchema.partial();

const surveyListSchema = z.object({
	page: z.number().int().min(1).default(1),
	limit: z.number().int().min(1).max(100).default(20),
	status: z.enum(["draft", "published", "closed", "archived"]).optional(),
	search: z.string().optional(),
});

const surveyChangeStatusSchema = z.object({
	id: z.string(),
	status: z.enum(["draft", "published", "closed", "archived"]),
});

// Generate unique ID
function generateId(): string {
	return `survey_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export const surveyRouter = {
	// List surveys for the organization
	list: organizationProcedure
		.input(surveyListSchema)
		.handler(async ({ input, context }) => {
			const { page, limit, status, search } = input;
			const offset = (page - 1) * limit;

			const conditions = [
				eq(survey.organizationId, context.activeOrganization.id),
			];

			if (status) {
				conditions.push(eq(survey.status, status));
			}

			if (search) {
				const searchCondition = or(
					ilike(survey.title, `%${search}%`),
					ilike(survey.description, `%${search}%`),
				);
				if (searchCondition) {
					conditions.push(searchCondition);
				}
			}

			const [surveys, totalResult] = await Promise.all([
				db
					.select()
					.from(survey)
					.where(and(...conditions))
					.orderBy(desc(survey.createdAt))
					.limit(limit)
					.offset(offset),
				db
					.select({ count: count() })
					.from(survey)
					.where(and(...conditions)),
			]);

			return {
				data: surveys,
				pagination: {
					page,
					limit,
					total: totalResult[0]?.count ?? 0,
					totalPages: Math.ceil((totalResult[0]?.count ?? 0) / limit),
				},
			};
		}),

	// Get survey by ID (organization members)
	getById: organizationProcedure
		.input(z.object({ id: z.string() }))
		.handler(async ({ input, context }) => {
			const result = await db
				.select()
				.from(survey)
				.where(
					and(
						eq(survey.id, input.id),
						eq(survey.organizationId, context.activeOrganization.id),
					),
				)
				.limit(1);

			if (!result[0]) {
				throw new Error("Survey not found");
			}

			return result[0];
		}),

	// Get published survey by slug (public - for survey runner)
	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.handler(async ({ input }) => {
			const result = await db
				.select()
				.from(survey)
				.where(and(eq(survey.slug, input.slug), eq(survey.status, "published")))
				.limit(1);

			if (!result[0]) {
				throw new Error("Survey not found");
			}

			return result[0];
		}),

	// Create new survey
	create: adminProcedure
		.input(surveyCreateSchema)
		.handler(async ({ input, context }) => {
			// Check for duplicate slug
			const existing = await db
				.select()
				.from(survey)
				.where(eq(survey.slug, input.slug))
				.limit(1);

			if (existing[0]) {
				throw new Error("A survey with this slug already exists");
			}

			const id = generateId();
			await db.insert(survey).values({
				id,
				slug: input.slug,
				title: input.title,
				description: input.description ?? null,
				status: "draft",
				settings: input.settings ?? null,
				userId: context.session.user.id,
				organizationId: context.activeOrganization.id,
			});

			const result = await db
				.select()
				.from(survey)
				.where(eq(survey.id, id))
				.limit(1);
			return result[0];
		}),

	// Update survey
	update: adminProcedure
		.input(z.object({ id: z.string(), data: surveyUpdateSchema }))
		.handler(async ({ input, context }) => {
			// Verify ownership
			const existing = await db
				.select()
				.from(survey)
				.where(
					and(
						eq(survey.id, input.id),
						eq(survey.organizationId, context.activeOrganization.id),
					),
				)
				.limit(1);

			if (!existing[0]) {
				throw new Error("Survey not found");
			}

			// Check for duplicate slug if changing
			if (input.data.slug && input.data.slug !== existing[0].slug) {
				const duplicateSlug = await db
					.select()
					.from(survey)
					.where(eq(survey.slug, input.data.slug))
					.limit(1);

				if (duplicateSlug[0]) {
					throw new Error("A survey with this slug already exists");
				}
			}

			await db
				.update(survey)
				.set({
					...(input.data.slug && { slug: input.data.slug }),
					...(input.data.title !== undefined && { title: input.data.title }),
					...(input.data.description !== undefined && {
						description: input.data.description ?? null,
					}),
					...(input.data.settings !== undefined && {
						settings: input.data.settings ?? null,
					}),
				})
				.where(eq(survey.id, input.id));

			const result = await db
				.select()
				.from(survey)
				.where(eq(survey.id, input.id))
				.limit(1);
			return result[0];
		}),

	// Change survey status
	changeStatus: adminProcedure
		.input(surveyChangeStatusSchema)
		.handler(async ({ input, context }) => {
			// Verify ownership
			const existing = await db
				.select()
				.from(survey)
				.where(
					and(
						eq(survey.id, input.id),
						eq(survey.organizationId, context.activeOrganization.id),
					),
				)
				.limit(1);

			if (!existing[0]) {
				throw new Error("Survey not found");
			}

			await db
				.update(survey)
				.set({ status: input.status })
				.where(eq(survey.id, input.id));

			const result = await db
				.select()
				.from(survey)
				.where(eq(survey.id, input.id))
				.limit(1);
			return result[0];
		}),

	// Delete survey (owner only)
	delete: ownerProcedure
		.input(z.object({ id: z.string() }))
		.handler(async ({ input, context }) => {
			// Verify ownership
			const existing = await db
				.select()
				.from(survey)
				.where(
					and(
						eq(survey.id, input.id),
						eq(survey.organizationId, context.activeOrganization.id),
					),
				)
				.limit(1);

			if (!existing[0]) {
				throw new Error("Survey not found");
			}

			await db.delete(survey).where(eq(survey.id, input.id));
			return { success: true };
		}),

	// Bulk delete surveys (owner only)
	bulkDelete: ownerProcedure
		.input(z.object({ ids: z.array(z.string()) }))
		.handler(async ({ input, context }) => {
			// Verify all surveys belong to organization
			const surveysToDelete = await db
				.select()
				.from(survey)
				.where(
					and(
						inArray(survey.id, input.ids),
						eq(survey.organizationId, context.activeOrganization.id),
					),
				);

			if (surveysToDelete.length !== input.ids.length) {
				throw new Error("Some surveys not found or not accessible");
			}

			await db.delete(survey).where(inArray(survey.id, input.ids));
			return { success: true, deletedCount: surveysToDelete.length };
		}),
};
