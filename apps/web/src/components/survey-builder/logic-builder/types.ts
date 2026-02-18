import type { Question } from "@orksys-survey/db";

export interface LogicRuleFormProps {
	surveyId: string;
	questions: Question[];
	sourceQuestionId: string;
	targetQuestions: Question[];
	existingRule: {
		id: string;
		operator: string;
		action: string;
		conditionValue: string | null;
		targetQuestionId: string | null;
	} | null;
	onSuccess: () => void;
	onCancel: () => void;
}

export type LogicRuleOperator =
	| "equals"
	| "not_equals"
	| "contains"
	| "greater_than"
	| "less_than"
	| "is_empty"
	| "is_not_empty";

export type LogicRuleAction =
	| "jump_to"
	| "skip"
	| "show"
	| "hide"
	| "end_survey";

export interface LogicRuleFormValue {
	operator: string;
	conditionValue: string;
	action: string;
	targetQuestionId: string;
}
