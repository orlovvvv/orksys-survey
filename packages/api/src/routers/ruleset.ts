import { db } from "@orksys-survey/db";
import { ruleSet } from "@orksys-survey/db/schema/survey";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, publicProcedure } from "../index";

const ruleSetConfigSchema = z.object({
	pattern: z.string().optional(),
	mask: z.string().optional(),
	prefix: z.string().optional(),
	suffix: z.string().optional(),
	inputType: z.string().optional(),
	placeholder: z.string().optional(),
	min: z.number().optional(),
	max: z.number().optional(),
	step: z.number().optional(),
	validationMessage: z.string().optional(),
});

const ruleSetCreateSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	type: z.string(),
	config: ruleSetConfigSchema,
	isSystem: z.boolean().default(false),
});

export const ruleSetRouter = {
	// List all rulesets
	list: publicProcedure.handler(async () => {
		return await db.select().from(ruleSet).orderBy(ruleSet.name);
	}),

	// Get ruleset by ID
	get: publicProcedure
		.input(z.object({ id: z.string() }))
		.handler(async ({ input }) => {
			const result = await db
				.select()
				.from(ruleSet)
				.where(eq(ruleSet.id, input.id))
				.limit(1);
			return result[0];
		}),

	// Create ruleset (admin only)
	create: adminProcedure
		.input(ruleSetCreateSchema)
		.handler(async ({ input }) => {
			const id = `rs_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
			await db.insert(ruleSet).values({
				id,
				...input,
				description: input.description ?? null,
			});

			const result = await db
				.select()
				.from(ruleSet)
				.where(eq(ruleSet.id, id))
				.limit(1);
			return result[0];
		}),

	// Delete ruleset (admin only)
	delete: adminProcedure
		.input(z.object({ id: z.string() }))
		.handler(async ({ input }) => {
			await db.delete(ruleSet).where(eq(ruleSet.id, input.id));
			return { success: true };
		}),
};
