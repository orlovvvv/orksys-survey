import type { Question, Survey, SurveySettings } from "@orksys-survey/db";

// Extended survey type that includes organization from API
interface SurveyWithOrganization extends Survey {
	organization?: {
		id: string;
		name: string;
		slug: string;
		logo: string | null;
	};
}

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { client } from "@/utils/orpc";

import type { AnswerValue } from "../context";
import { validateAnswer } from "../utils/validation";

export interface UseRunnerActionsOptions {
	survey: Survey;
	visibleQuestions: Question[];
	sortedQuestions: Question[];
	currentQuestionIndex: number;
	answers: Map<string, AnswerValue>;
	fingerprint: string | null;
	respondentId: string | null;
	setAnswers: React.Dispatch<React.SetStateAction<Map<string, AnswerValue>>>;
	setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
	setIsComplete: React.Dispatch<React.SetStateAction<boolean>>;
	onComplete?: () => void;
}

export interface UseRunnerActionsResult {
	// Actions
	setAnswer: (questionId: string, value: AnswerValue) => void;
	goNext: () => void;
	goBack: () => void;
	submit: () => Promise<void>;
	validateAllQuestions: () => Map<string, string>;

	// State
	isSubmitting: boolean;
	currentError: string | null;
	clearError: () => void;
}

/**
 * Provides navigation and submission actions for the survey runner.
 *
 * This hook handles:
 * - Setting answers
 * - Navigating between questions
 * - Submitting the survey response
 * - Validation
 */
export function useRunnerActions({
	survey,
	visibleQuestions,
	sortedQuestions,
	currentQuestionIndex,
	answers,
	fingerprint,
	respondentId,
	setAnswers,
	setCurrentQuestionIndex,
	setIsComplete,
	onComplete,
}: UseRunnerActionsOptions): UseRunnerActionsResult {
	const router = useRouter();
	const [currentError, setCurrentError] = useState<string | null>(null);

	// Get current visible question
	const currentVisibleIndex = useMemo(() => {
		const currentId = sortedQuestions[currentQuestionIndex]?.id;
		if (!currentId) return 0;
		return visibleQuestions.findIndex((q) => q.id === currentId);
	}, [sortedQuestions, currentQuestionIndex, visibleQuestions]);

	const currentQuestion = visibleQuestions[currentVisibleIndex];

	const canGoBack = currentVisibleIndex > 0;
	const canGoNext = currentVisibleIndex < visibleQuestions.length - 1;

	// Submit mutation
	const submitMutation = useMutation({
		mutationFn: async () => {
			const answersArray = Array.from(answers.entries()).map(
				([questionId, value]) => ({
					questionId,
					value,
				}),
			);

			// If we have a respondentId, use saveProgress to maintain consistency
			if (respondentId) {
				return client.response.saveProgress({
					surveyId: survey.id,
					respondentId,
					fingerprint: fingerprint ?? undefined,
					answers: answersArray,
					currentQuestionIndex,
					isComplete: true,
					metadata: {
						userAgent: navigator.userAgent,
						language: navigator.language,
						timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
					},
				});
			}

			// Fallback to original submit endpoint
			return client.response.submit({
				surveyId: survey.id,
				fingerprint: fingerprint ?? undefined,
				answers: answersArray,
				isComplete: true,
				metadata: {
					userAgent: navigator.userAgent,
					language: navigator.language,
					timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				},
			});
		},
		onSuccess: () => {
			setIsComplete(true);
			if (onComplete) {
				onComplete();
			} else {
				// Navigate to complete page
				const surveyWithOrg = survey as SurveyWithOrganization;
				const orgSlug = surveyWithOrg.organization?.slug;
				const completeUrl = orgSlug
					? `/s/${orgSlug}/${survey.slug}/complete`
					: `/s/${survey.slug}/complete`;
				const settings = survey.settings as SurveySettings | null;
				if (settings?.thankYouMessage || settings?.redirectUrl) {
					const params = new URLSearchParams();
					if (settings.thankYouMessage) {
						params.set("message", settings.thankYouMessage);
					}
					if (settings.redirectUrl) {
						params.set("redirectUrl", settings.redirectUrl);
					}
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					router.push(`${completeUrl}?${params.toString()}` as any);
				} else {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					router.push(completeUrl as any);
				}
			}
		},
		onError: (error) => {
			toast.error(error.message || "Failed to submit response");
		},
	});

	// Actions
	const setAnswer = useCallback(
		(questionId: string, value: AnswerValue) => {
			setAnswers((prev: Map<string, AnswerValue>) => {
				const next = new Map(prev);
				next.set(questionId, value);
				return next;
			});
			setCurrentError(null);
		},
		[setAnswers],
	);

	const goNext = useCallback(() => {
		if (!currentQuestion) return;

		// Validate current question
		const answer = answers.get(currentQuestion.id);
		const error = validateAnswer(currentQuestion, answer);
		if (error) {
			setCurrentError(error);
			return;
		}

		if (canGoNext) {
			const nextVisibleQuestion = visibleQuestions[currentVisibleIndex + 1];
			if (nextVisibleQuestion) {
				const nextIndex = sortedQuestions.findIndex(
					(q) => q.id === nextVisibleQuestion.id,
				);
				setCurrentQuestionIndex(nextIndex);
			}
		}
	}, [
		currentQuestion,
		answers,
		canGoNext,
		visibleQuestions,
		currentVisibleIndex,
		sortedQuestions,
		setCurrentQuestionIndex,
	]);

	const goBack = useCallback(() => {
		if (!canGoBack) return;

		const prevVisibleQuestion = visibleQuestions[currentVisibleIndex - 1];
		if (prevVisibleQuestion) {
			const prevIndex = sortedQuestions.findIndex(
				(q) => q.id === prevVisibleQuestion.id,
			);
			setCurrentQuestionIndex(prevIndex);
		}
	}, [
		canGoBack,
		visibleQuestions,
		currentVisibleIndex,
		sortedQuestions,
		setCurrentQuestionIndex,
	]);

	const submit = useCallback(async () => {
		if (!currentQuestion) return;

		// Validate current question
		const answer = answers.get(currentQuestion.id);
		const error = validateAnswer(currentQuestion, answer);
		if (error) {
			setCurrentError(error);
			return;
		}

		await submitMutation.mutateAsync();
	}, [currentQuestion, answers, submitMutation]);

	const clearError = useCallback(() => {
		setCurrentError(null);
	}, []);

	const validateAllQuestions = useCallback(() => {
		const errors = new Map<string, string>();
		for (const question of visibleQuestions) {
			const answer = answers.get(question.id);
			const error = validateAnswer(question, answer);
			if (error) {
				errors.set(question.id, error);
			}
		}
		return errors;
	}, [visibleQuestions, answers]);

	return {
		setAnswer,
		goNext,
		goBack,
		submit,
		validateAllQuestions,
		isSubmitting: submitMutation.isPending,
		currentError,
		clearError,
	};
}
