import z from "zod";

export const logicRuleSchema = z.object({
	operator: z.enum([
		"equals",
		"not_equals",
		"contains",
		"greater_than",
		"less_than",
		"is_empty",
		"is_not_empty",
	]),
	conditionValue: z.string(),
	action: z.enum(["jump_to", "skip", "show", "hide", "end_survey"]),
	targetQuestionId: z.string(),
});

export type LogicRuleFormData = z.infer<typeof logicRuleSchema>;
