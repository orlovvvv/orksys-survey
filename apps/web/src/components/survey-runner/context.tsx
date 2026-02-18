"use client";

import type {
	LogicRule,
	Question,
	Survey,
	SurveySettings,
} from "@orksys-survey/db";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { toast } from "sonner";
import { client } from "@/utils/orpc";
import { useFingerprint } from "./hooks/use-fingerprint";
import { useLogicEvaluator } from "./hooks/use-logic-evaluator";
import { validateAnswer } from "./utils/validation";

export type AnswerValue = unknown;

interface SurveyRunnerContextValue {
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

	// Navigation
	canGoBack: boolean;
	canGoNext: boolean;
	isComplete: boolean;
	isSubmitting: boolean;

	// Actions
	setAnswer: (questionId: string, value: AnswerValue) => void;
	goNext: () => void;
	goBack: () => void;
	submit: () => Promise<void>;
	validateAllQuestions: () => Map<string, string>;

	// Metadata
	fingerprint: string | null;

	// Error state
	currentError: string | null;
	clearError: () => void;
}

const SurveyRunnerContext = createContext<SurveyRunnerContextValue | null>(
	null,
);

export function useSurveyRunner() {
	const context = useContext(SurveyRunnerContext);
	if (!context) {
		throw new Error(
			"useSurveyRunner must be used within a SurveyRunner component",
		);
	}
	return context;
}

interface SurveyRunnerProviderProps {
	survey: Survey;
	questions: Question[];
	logicRules?: LogicRule[];
	children: React.ReactNode;
	onComplete?: () => void;
}

export function SurveyRunnerProvider({
	survey,
	questions: allQuestions,
	logicRules = [],
	children,
	onComplete,
}: SurveyRunnerProviderProps) {
	const router = useRouter();
	const fingerprint = useFingerprint();
	const [answers, setAnswers] = useState<Map<string, AnswerValue>>(new Map());
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [currentError, setCurrentError] = useState<string | null>(null);
	const [isComplete, setIsComplete] = useState(false);

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

	const currentQuestion = visibleQuestions[currentVisibleIndex];

	// Navigation state
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
				const completeUrl = `/s/${survey.slug}/complete`;
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
	const setAnswer = useCallback((questionId: string, value: AnswerValue) => {
		setAnswers((prev) => {
			const next = new Map(prev);
			next.set(questionId, value);
			return next;
		});
		setCurrentError(null);
	}, []);

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
	}, [canGoBack, visibleQuestions, currentVisibleIndex, sortedQuestions]);

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

	const displayMode =
		(survey.settings as SurveySettings | null)?.displayMode ?? "one_at_a_time";

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

	const value: SurveyRunnerContextValue = {
		survey,
		questions: sortedQuestions,
		settings: survey.settings as SurveySettings | null,
		logicRules,
		displayMode,
		answers,
		currentQuestionIndex,
		visibleQuestionIds,
		visibleQuestions,
		canGoBack,
		canGoNext,
		isComplete,
		isSubmitting: submitMutation.isPending,
		setAnswer,
		goNext,
		goBack,
		submit,
		validateAllQuestions,
		fingerprint,
		currentError,
		clearError,
	};

	return (
		<SurveyRunnerContext.Provider value={value}>
			{children}
		</SurveyRunnerContext.Provider>
	);
}
