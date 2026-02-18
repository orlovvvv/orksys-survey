import type { LogicRule, Question } from "@orksys-survey/db";

// Extract enum values as types
type LogicOperator =
	| "equals"
	| "not_equals"
	| "contains"
	| "greater_than"
	| "less_than"
	| "is_empty"
	| "is_not_empty";
type LogicAction = "jump_to" | "skip" | "show" | "hide" | "end_survey";

/**
 * Represents an answer value in the survey response system.
 * Can be a primitive value, an array (for checkboxes), or null/undefined.
 * Note: This is also defined in context.tsx - use that one for external imports.
 */
export type AnswerValue = unknown;

/**
 * Map of question IDs to their answer values.
 */
export type AnswersMap = Map<string, AnswerValue> | Record<string, AnswerValue>;

/**
 * Result of evaluating a single logic rule.
 */
export interface RuleEvaluationResult {
	ruleId: string;
	matches: boolean;
	action: LogicAction;
	targetQuestionId?: string | null;
}

/**
 * Result of evaluating all logic rules for the current state.
 */
export interface LogicEvaluationResult {
	/**
	 * Set of question IDs that should be visible based on current answers.
	 * Questions not in this set should be hidden.
	 */
	visibleQuestionIds: Set<string>;

	/**
	 * Navigation action to apply, if any.
	 */
	navigationAction: {
		type: "jump_to" | "skip" | "end_survey";
		targetQuestionId?: string;
	} | null;

	/**
	 * Whether the survey should end early based on logic rules.
	 */
	shouldEndSurvey: boolean;

	/**
	 * Individual rule evaluation results for debugging/logging.
	 */
	ruleResults: RuleEvaluationResult[];
}

/**
 * Converts an answers map to a Record for easier access.
 */
function normalizeAnswers(answers: AnswersMap): Record<string, AnswerValue> {
	if (answers instanceof Map) {
		const record: Record<string, AnswerValue> = {};
		for (const [key, value] of answers.entries()) {
			record[key] = value;
		}
		return record;
	}
	return answers;
}

/**
 * Evaluates a condition operator against an answer value and condition value.
 */
export function evaluateCondition(
	operator: LogicOperator,
	answerValue: AnswerValue,
	conditionValue: unknown,
): boolean {
	switch (operator) {
		case "equals": {
			// Handle array answers (checkboxes)
			if (Array.isArray(answerValue)) {
				return answerValue.some((v) => v === conditionValue);
			}
			// Handle null/undefined
			if (answerValue == null) {
				return conditionValue == null || conditionValue === "";
			}
			// String comparison (case-insensitive for user-facing strings)
			if (
				typeof answerValue === "string" &&
				typeof conditionValue === "string"
			) {
				return answerValue.toLowerCase() === conditionValue.toLowerCase();
			}
			// Number comparison
			if (
				typeof answerValue === "number" &&
				typeof conditionValue === "number"
			) {
				return answerValue === conditionValue;
			}
			// Fallback to strict equality
			return answerValue === conditionValue;
		}

		case "not_equals": {
			return !evaluateCondition("equals", answerValue, conditionValue);
		}

		case "contains": {
			// Handle array answers (checkboxes - check if any value contains)
			if (Array.isArray(answerValue)) {
				return answerValue.some((v) =>
					evaluateCondition("contains", v, conditionValue),
				);
			}
			// String contains check
			if (
				typeof answerValue === "string" &&
				typeof conditionValue === "string"
			) {
				return answerValue.toLowerCase().includes(conditionValue.toLowerCase());
			}
			// For non-strings, treat as equality check
			return answerValue === conditionValue;
		}

		case "greater_than": {
			const answerNum = Number(answerValue);
			const conditionNum = Number(conditionValue);
			if (Number.isNaN(answerNum) || Number.isNaN(conditionNum)) {
				return false;
			}
			return answerNum > conditionNum;
		}

		case "less_than": {
			const answerNum = Number(answerValue);
			const conditionNum = Number(conditionValue);
			if (Number.isNaN(answerNum) || Number.isNaN(conditionNum)) {
				return false;
			}
			return answerNum < conditionNum;
		}

		case "is_empty": {
			if (answerValue == null) return true;
			if (typeof answerValue === "string") return answerValue.trim() === "";
			if (Array.isArray(answerValue)) return answerValue.length === 0;
			return false;
		}

		case "is_not_empty": {
			return !evaluateCondition("is_empty", answerValue, conditionValue);
		}

		default:
			return false;
	}
}

/**
 * Evaluates a single logic rule against the current answers.
 */
export function evaluateRule(
	rule: LogicRule,
	answers: AnswersMap,
): RuleEvaluationResult {
	const normalizedAnswers = normalizeAnswers(answers);
	const answerValue = normalizedAnswers[rule.sourceQuestionId];

	const matches = evaluateCondition(
		rule.operator,
		answerValue,
		rule.conditionValue,
	);

	return {
		ruleId: rule.id,
		matches,
		action: rule.action,
		targetQuestionId: rule.targetQuestionId,
	};
}

/**
 * Evaluates all logic rules and determines visibility and navigation actions.
 *
 * Rules are evaluated in order, and actions are applied as follows:
 * - show/hide: Accumulates to determine final visibility
 * - jump_to: Returns first matching jump action
 * - skip: Returns first matching skip action
 * - end_survey: Returns true if any matching rule has this action
 *
 * @param rules - All logic rules for the survey
 * @param answers - Current answers (questionId -> value mapping)
 * @param allQuestionIds - All question IDs in the survey (for visibility default)
 * @param currentQuestionId - The current question being displayed (for context)
 * @returns Logic evaluation result with visibility, navigation, and survey end state
 */
export function evaluateLogic(
	rules: LogicRule[],
	answers: AnswersMap,
	allQuestionIds: string[],
	currentQuestionId?: string,
): LogicEvaluationResult {
	const visibleQuestionIds = new Set(allQuestionIds);
	const ruleResults: RuleEvaluationResult[] = [];
	let navigationAction: LogicEvaluationResult["navigationAction"] = null;
	let shouldEndSurvey = false;

	// First pass: evaluate all rules and collect actions
	for (const rule of rules) {
		const result = evaluateRule(rule, answers);
		ruleResults.push(result);

		if (!result.matches) {
			continue;
		}

		// Process matching rules based on action type
		switch (result.action) {
			case "show": {
				if (result.targetQuestionId) {
					visibleQuestionIds.add(result.targetQuestionId);
				}
				break;
			}

			case "hide": {
				if (result.targetQuestionId) {
					visibleQuestionIds.delete(result.targetQuestionId);
				}
				break;
			}

			case "jump_to": {
				// Only set if we haven't found a navigation action yet
				if (!navigationAction && result.targetQuestionId) {
					navigationAction = {
						type: "jump_to",
						targetQuestionId: result.targetQuestionId,
					};
				}
				break;
			}

			case "skip": {
				// Skip means jump to the next visible question
				if (!navigationAction && currentQuestionId) {
					navigationAction = {
						type: "skip",
					};
				}
				break;
			}

			case "end_survey": {
				shouldEndSurvey = true;
				break;
			}
		}
	}

	// Ensure current question is always visible
	if (currentQuestionId) {
		visibleQuestionIds.add(currentQuestionId);
	}

	return {
		visibleQuestionIds,
		navigationAction,
		shouldEndSurvey,
		ruleResults,
	};
}

/**
 * Gets the next visible question ID after the current one.
 * Useful for implementing "skip" action navigation.
 */
export function getNextVisibleQuestionId(
	currentQuestionId: string,
	allQuestionIds: string[],
	visibleQuestionIds: Set<string>,
): string | null {
	const currentIndex = allQuestionIds.indexOf(currentQuestionId);
	if (currentIndex === -1) {
		return null;
	}

	for (let i = currentIndex + 1; i < allQuestionIds.length; i++) {
		const nextId = allQuestionIds[i];
		if (nextId && visibleQuestionIds.has(nextId)) {
			return nextId;
		}
	}

	return null;
}

/**
 * Filters questions based on visibility rules.
 * Returns questions sorted by their order.
 */
export function filterVisibleQuestions<T extends Question>(
	questions: T[],
	visibleQuestionIds: Set<string>,
): T[] {
	return questions
		.filter((q) => visibleQuestionIds.has(q.id))
		.sort((a, b) => a.order - b.order);
}
