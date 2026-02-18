import type { LogicRule, Question } from "@orksys-survey/db";
import { useMemo } from "react";

import {
	type AnswersMap,
	evaluateLogic,
	getNextVisibleQuestionId,
	type LogicEvaluationResult,
} from "../utils/logic-engine";

/**
 * Configuration options for the logic evaluator hook.
 */
export interface UseLogicEvaluatorOptions {
	/**
	 * All logic rules for the survey.
	 */
	rules: LogicRule[];

	/**
	 * Current answers provided by the respondent.
	 */
	answers: AnswersMap;

	/**
	 * All questions in the survey.
	 */
	questions: Question[];

	/**
	 * The current question being displayed (optional).
	 * Used for context in navigation actions.
	 */
	currentQuestionId?: string;
}

/**
 * Result returned by the useLogicEvaluator hook.
 */
export interface UseLogicEvaluatorResult extends LogicEvaluationResult {
	/**
	 * Array of visible question IDs in order.
	 */
	visibleQuestionIdOrder: string[];

	/**
	 * Gets the next visible question ID after a given question.
	 */
	getNextQuestionId: (questionId: string) => string | null;

	/**
	 * Gets the previous visible question ID before a given question.
	 */
	getPreviousQuestionId: (questionId: string) => string | null;

	/**
	 * Checks if a specific question is visible.
	 */
	isQuestionVisible: (questionId: string) => boolean;

	/**
	 * Gets the index of a question in the visible order.
	 */
	getVisibleIndex: (questionId: string) => number;

	/**
	 * Total number of visible questions.
	 */
	visibleCount: number;
}

/**
 * Gets the previous visible question ID before the current one.
 */
function getPreviousVisibleQuestionId(
	currentQuestionId: string,
	allQuestionIds: string[],
	visibleQuestionIds: Set<string>,
): string | null {
	const currentIndex = allQuestionIds.indexOf(currentQuestionId);
	if (currentIndex <= 0) {
		return null;
	}

	for (let i = currentIndex - 1; i >= 0; i--) {
		const prevId = allQuestionIds[i];
		if (prevId && visibleQuestionIds.has(prevId)) {
			return prevId;
		}
	}

	return null;
}

/**
 * React hook for evaluating survey logic rules at runtime.
 *
 * This hook takes the current state (answers, rules, questions) and computes:
 * - Which questions should be visible
 * - Any navigation actions to apply
 * - Whether the survey should end early
 *
 * It automatically recalculates when answers or rules change.
 *
 * @example
 * ```tsx
 * const {
 *   visibleQuestionIds,
 *   navigationAction,
 *   shouldEndSurvey,
 *   getNextQuestionId,
 *   isQuestionVisible,
 * } = useLogicEvaluator({
 *   rules: survey.logicRules,
 *   answers: responses,
 *   questions: survey.questions,
 *   currentQuestionId: currentQuestion?.id,
 * });
 *
 * // Handle navigation action
 * useEffect(() => {
 *   if (navigationAction?.type === 'jump_to' && navigationAction.targetQuestionId) {
 *     goToQuestion(navigationAction.targetQuestionId);
 *   }
 * }, [navigationAction]);
 * ```
 */
export function useLogicEvaluator({
	rules,
	answers,
	questions,
	currentQuestionId,
}: UseLogicEvaluatorOptions): UseLogicEvaluatorResult {
	// Memoize question IDs array for stable references
	const allQuestionIds = useMemo(
		() =>
			questions
				.map((q) => q.id)
				.sort((a, b) => {
					const orderA = questions.find((q) => q.id === a)?.order ?? 0;
					const orderB = questions.find((q) => q.id === b)?.order ?? 0;
					return orderA - orderB;
				}),
		[questions],
	);

	// Evaluate logic rules
	const evaluationResult = useMemo(() => {
		return evaluateLogic(rules, answers, allQuestionIds, currentQuestionId);
	}, [rules, answers, allQuestionIds, currentQuestionId]);

	// Compute ordered array of visible question IDs
	const visibleQuestionIdOrder = useMemo(() => {
		return allQuestionIds.filter((id) =>
			evaluationResult.visibleQuestionIds.has(id),
		);
	}, [allQuestionIds, evaluationResult.visibleQuestionIds]);

	// Helper functions
	const getNextQuestionId = (questionId: string): string | null => {
		return getNextVisibleQuestionId(
			questionId,
			allQuestionIds,
			evaluationResult.visibleQuestionIds,
		);
	};

	const getPreviousQuestionId = (questionId: string): string | null => {
		return getPreviousVisibleQuestionId(
			questionId,
			allQuestionIds,
			evaluationResult.visibleQuestionIds,
		);
	};

	const isQuestionVisible = (questionId: string): boolean => {
		return evaluationResult.visibleQuestionIds.has(questionId);
	};

	const getVisibleIndex = (questionId: string): number => {
		return visibleQuestionIdOrder.indexOf(questionId);
	};

	return {
		...evaluationResult,
		visibleQuestionIdOrder,
		getNextQuestionId,
		getPreviousQuestionId,
		isQuestionVisible,
		getVisibleIndex,
		visibleCount: visibleQuestionIdOrder.length,
	};
}
