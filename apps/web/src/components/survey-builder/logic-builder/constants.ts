import type { LogicRuleAction, LogicRuleOperator } from "./types";

export const operatorLabels: [LogicRuleOperator, string][] = [
	["equals", "Equals"],
	["not_equals", "Does not equal"],
	["contains", "Contains"],
	["greater_than", "Is greater than"],
	["less_than", "Is less than"],
	["is_empty", "Is empty"],
	["is_not_empty", "Is not empty"],
];

export const actionLabels: [LogicRuleAction, string][] = [
	["jump_to", "Jump to question"],
	["skip", "Skip to next"],
	["show", "Show question"],
	["hide", "Hide question"],
	["end_survey", "End survey"],
];

export const operatorsNeedingConditionValue: LogicRuleOperator[] = [];

export const actionsNeedingTargetQuestion: LogicRuleAction[] = [
	"jump_to",
	"show",
	"hide",
];

export const needsConditionValue = (operator: string): boolean => {
	return !["is_empty", "is_not_empty"].includes(operator);
};

export const needsTargetQuestion = (action: string): boolean => {
	return ["jump_to", "show", "hide"].includes(action);
};
