import type {
	LogicRule,
	Question,
	Survey,
	SurveySettings,
} from "@orksys-survey/db";
import { useCallback, useMemo, useState } from "react";

import type { AnswerValue } from "../context";
import { useFingerprint } from "./use-fingerprint";
import { useLogicEvaluator } from "./use-logic-evaluator";
import { useRespondentToken } from "./use-respondent-token";
import type { ExistingResponse } from "./use-response-persistence";
import { useResponsePersistence } from "./use-response-persistence";

export interface UseRunnerStateOptions {
	survey: Survey;
	questions: Question[];
	logicRules: LogicRule[];
}

export interface UseRunnerStateResult {
	// Survey data
	survey: Survey;
	questions: Question[];
	settings: SurveySettings | null;
	logicRules: LogicRule[];
	displayMode: "one_at_a_time" | "list";

	// Response state
	answers: Map<string, AnswerValue>;
	currentQuestionIndex: number;
	visibleQuestionIds: Set<string>;
	visibleQuestions: Question[];
	sortedQuestions: Question[];

	// Navigation state
	canGoBack: boolean;
	canGoNext: boolean;
	isComplete: boolean;

	// Metadata
	fingerprint: string | null;
	respondentId: string | null;

	// Persistence state
	isLoadingToken: boolean;
	isLoadingExisting: boolean;
	existingResponse: ExistingResponse | null;
	isSaving: boolean;
	hasRestored: boolean;

	// Actions
	setAnswers: React.Dispatch<React.SetStateAction<Map<string, AnswerValue>>>;
	setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
	setIsComplete: React.Dispatch<React.SetStateAction<boolean>>;
	restoreFromExisting: (existing: ExistingResponse) => void;
	saveProgress: () => Promise<void>;
}

/**
 * Manages the state for the survey runner.
 *
 * This hook handles:
 * - Sorting questions by order
 * - Managing answer state
 * - Evaluating logic rules to determine visibility
 * - Computing navigation state (canGoBack, canGoNext)
 * - Token-based respondent tracking
 * - Response persistence and restoration
 */
export function useRunnerState({
	survey,
	questions: allQuestions,
	logicRules,
}: UseRunnerStateOptions): UseRunnerStateResult {
	const fingerprint = useFingerprint();
	const { respondentId, isLoading: isLoadingToken } = useRespondentToken(
		survey.id,
	);
	const [answers, setAnswers] = useState<Map<string, AnswerValue>>(new Map());
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [isComplete, setIsComplete] = useState(false);
	const [hasRestored, setHasRestored] = useState(false);

	// Response persistence
	const { existingResponse, isLoadingExisting, isSaving, saveNow } =
		useResponsePersistence({
			surveyId: survey.id,
			respondentId,
			answers,
			fingerprint,
			currentQuestionIndex,
			enabled: !hasRestored, // Only check for existing before restoration
		});

	// Sort questions by order
	const sortedQuestions = useMemo(
		() => [...allQuestions].sort((a, b) => a.order - b.order),
		[allQuestions],
	);

	// Evaluate logic to determine visibility
	const { visibleQuestionIds } = useLogicEvaluator({
		rules: logicRules,
		answers,
		questions: sortedQuestions,
		currentQuestionId: sortedQuestions[currentQuestionIndex]?.id,
	});

	// Get visible questions
	const visibleQuestions = useMemo(
		() => sortedQuestions.filter((q) => visibleQuestionIds.has(q.id)),
		[sortedQuestions, visibleQuestionIds],
	);

	// Get current visible question
	const currentVisibleIndex = useMemo(() => {
		const currentId = sortedQuestions[currentQuestionIndex]?.id;
		if (!currentId) return 0;
		return visibleQuestions.findIndex((q) => q.id === currentId);
	}, [sortedQuestions, currentQuestionIndex, visibleQuestions]);

	// Navigation state
	const canGoBack = currentVisibleIndex > 0;
	const canGoNext = currentVisibleIndex < visibleQuestions.length - 1;

	const displayMode =
		(survey.settings as SurveySettings | null)?.displayMode ?? "one_at_a_time";

	// Restore state from existing response
	const restoreFromExisting = useCallback((existing: ExistingResponse) => {
		const restoredAnswers = new Map<string, AnswerValue>();
		for (const answer of existing.answers) {
			restoredAnswers.set(answer.questionId, answer.value as AnswerValue);
		}
		setAnswers(restoredAnswers);
		setHasRestored(true);
	}, []);

	return {
		survey,
		questions: sortedQuestions,
		settings: survey.settings as SurveySettings | null,
		logicRules,
		displayMode,
		answers,
		currentQuestionIndex,
		visibleQuestionIds,
		visibleQuestions,
		sortedQuestions,
		canGoBack,
		canGoNext,
		isComplete,
		fingerprint,
		respondentId,
		isLoadingToken,
		isLoadingExisting,
		existingResponse,
		isSaving,
		hasRestored,
		setAnswers,
		setCurrentQuestionIndex,
		setIsComplete,
		restoreFromExisting,
		saveProgress: saveNow,
	};
}
