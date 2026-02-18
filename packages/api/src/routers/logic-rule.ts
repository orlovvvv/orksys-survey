import { db } from "@orksys-survey/db";
import { logicRule, question, survey } from "@orksys-survey/db/schema/survey";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { adminProcedure, organizationProcedure } from "../index";

// Input schemas
const logicRuleCreateSchema = z.object({
	surveyId: z.string(),
	sourceQuestionId: z.string(),
	operator: z.enum([
		"equals",
		"not_equals",
		"contains",
		"greater_than",
		"less_than",
		"is_empty",
		"is_not_empty",
	]),
	conditionValue: z.unknown().optional(),
	action: z.enum(["jump_to", "skip", "show", "hide", "end_survey"]),
	targetQuestionId: z.string().optional(),
});

const logicRuleUpdateSchema = logicRuleCreateSchema
	.partial()
	.omit({ surveyId: true });

// Generate unique ID
function generateId(): string {
	return `lr_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
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

// Verify question belongs to survey
async function verifyQuestionBelongsToSurvey(
	questionId: string,
	surveyId: string,
): Promise<void> {
	const result = await db
		.select()
		.from(question)
		.where(and(eq(question.id, questionId), eq(question.surveyId, surveyId)))
		.limit(1);

	if (!result[0]) {
		throw new Error("Question not found in this survey");
	}
}

// Check for circular dependencies in jump logic
function checkForCircularDependencies(
	rules: Array<{
		sourceQuestionId: string;
		targetQuestionId: string | null;
		action: string;
	}>,
): boolean {
	// Build a graph of question jumps
	const graph = new Map<string, Set<string>>();

	for (const rule of rules) {
		if (rule.targetQuestionId && rule.action !== "end_survey") {
			const neighbors = graph.get(rule.sourceQuestionId);
			if (neighbors) {
				neighbors.add(rule.targetQuestionId);
			} else {
				graph.set(rule.sourceQuestionId, new Set([rule.targetQuestionId]));
			}
		}
	}

	// DFS to detect cycles
	const visited = new Set<string>();
	const recursionStack = new Set<string>();

	function hasCycle(node: string): boolean {
		visited.add(node);
		recursionStack.add(node);

		const neighbors = graph.get(node);
		if (neighbors) {
			for (const neighbor of neighbors) {
				if (!visited.has(neighbor)) {
					if (hasCycle(neighbor)) return true;
				} else if (recursionStack.has(neighbor)) {
					return true;
				}
			}
		}

		recursionStack.delete(node);
		return false;
	}

	for (const node of graph.keys()) {
		if (!visited.has(node)) {
			if (hasCycle(node)) return true;
		}
	}

	return false;
}

export const logicRuleRouter = {
	// List logic rules for a survey
	list: organizationProcedure
		.input(z.object({ surveyId: z.string() }))
		.handler(async ({ input, context }) => {
			await verifySurveyAccess(input.surveyId, context.activeOrganization.id);

			const rules = await db
				.select()
				.from(logicRule)
				.where(eq(logicRule.surveyId, input.surveyId));

			return rules;
		}),

	// Create logic rule
	create: adminProcedure
		.input(logicRuleCreateSchema)
		.handler(async ({ input, context }) => {
			await verifySurveyAccess(input.surveyId, context.activeOrganization.id);
			await verifyQuestionBelongsToSurvey(
				input.sourceQuestionId,
				input.surveyId,
			);

			if (input.targetQuestionId) {
				await verifyQuestionBelongsToSurvey(
					input.targetQuestionId,
					input.surveyId,
				);
			}

			// Validate action requires target
			if (
				["jump_to", "show", "hide"].includes(input.action) &&
				!input.targetQuestionId
			) {
				throw new Error(`${input.action} action requires a target question`);
			}

			const id = generateId();
			await db.insert(logicRule).values({
				id,
				surveyId: input.surveyId,
				sourceQuestionId: input.sourceQuestionId,
				operator: input.operator,
				conditionValue: input.conditionValue ?? null,
				action: input.action,
				targetQuestionId: input.targetQuestionId ?? null,
			});

			const result = await db
				.select()
				.from(logicRule)
				.where(eq(logicRule.id, id))
				.limit(1);
			return result[0];
		}),

	// Update logic rule
	update: adminProcedure
		.input(z.object({ id: z.string(), data: logicRuleUpdateSchema }))
		.handler(async ({ input, context }) => {
			// Get existing rule
			const existing = await db
				.select()
				.from(logicRule)
				.where(eq(logicRule.id, input.id))
				.limit(1);

			if (!existing[0]) {
				throw new Error("Logic rule not found");
			}

			await verifySurveyAccess(
				existing[0].surveyId,
				context.activeOrganization.id,
			);

			// Verify new source/target questions if provided
			if (input.data.sourceQuestionId) {
				await verifyQuestionBelongsToSurvey(
					input.data.sourceQuestionId,
					existing[0].surveyId,
				);
			}

			if (input.data.targetQuestionId) {
				await verifyQuestionBelongsToSurvey(
					input.data.targetQuestionId,
					existing[0].surveyId,
				);
			}

			// Validate action requires target
			const action = input.data.action ?? existing[0].action;
			const targetQuestionId =
				input.data.targetQuestionId ?? existing[0].targetQuestionId;
			if (["jump_to", "show", "hide"].includes(action) && !targetQuestionId) {
				throw new Error(`${action} action requires a target question`);
			}

			await db
				.update(logicRule)
				.set({
					...(input.data.sourceQuestionId && {
						sourceQuestionId: input.data.sourceQuestionId,
					}),
					...(input.data.operator && { operator: input.data.operator }),
					...(input.data.conditionValue !== undefined && {
						conditionValue: input.data.conditionValue ?? null,
					}),
					...(input.data.action && { action: input.data.action }),
					...(input.data.targetQuestionId !== undefined && {
						targetQuestionId: input.data.targetQuestionId ?? null,
					}),
				})
				.where(eq(logicRule.id, input.id));

			const result = await db
				.select()
				.from(logicRule)
				.where(eq(logicRule.id, input.id))
				.limit(1);
			return result[0];
		}),

	// Delete logic rule
	delete: adminProcedure
		.input(z.object({ id: z.string() }))
		.handler(async ({ input, context }) => {
			// Get existing rule
			const existing = await db
				.select()
				.from(logicRule)
				.where(eq(logicRule.id, input.id))
				.limit(1);

			if (!existing[0]) {
				throw new Error("Logic rule not found");
			}

			await verifySurveyAccess(
				existing[0].surveyId,
				context.activeOrganization.id,
			);

			await db.delete(logicRule).where(eq(logicRule.id, input.id));
			return { success: true };
		}),

	// Validate logic rules for circular dependencies
	validate: adminProcedure
		.input(z.object({ surveyId: z.string() }))
		.handler(async ({ input, context }) => {
			await verifySurveyAccess(input.surveyId, context.activeOrganization.id);

			const rules = await db
				.select()
				.from(logicRule)
				.where(eq(logicRule.surveyId, input.surveyId));

			const hasCircularDependency = checkForCircularDependencies(
				rules.map((r) => ({
					sourceQuestionId: r.sourceQuestionId,
					targetQuestionId: r.targetQuestionId,
					action: r.action,
				})),
			);

			// Check for self-referential rules
			const selfReferential = rules.filter(
				(r) => r.sourceQuestionId === r.targetQuestionId,
			);

			// Check for conflicting rules (same source, different actions)
			const rulesBySource = new Map<string, typeof rules>();
			for (const rule of rules) {
				const existing = rulesBySource.get(rule.sourceQuestionId) ?? [];
				existing.push(rule);
				rulesBySource.set(rule.sourceQuestionId, existing);
			}

			const conflictingRules: string[] = [];
			for (const [sourceId, sourceRules] of rulesBySource) {
				if (sourceRules.length > 1) {
					// Check for conflicting actions
					const actions = new Set(sourceRules.map((r) => r.action));
					if (
						actions.has("jump_to") &&
						(actions.has("show") || actions.has("hide"))
					) {
						conflictingRules.push(sourceId);
					}
				}
			}

			return {
				valid: !hasCircularDependency && selfReferential.length === 0,
				hasCircularDependency,
				selfReferentialRules: selfReferential.map((r) => r.id),
				conflictingRules,
			};
		}),
};
