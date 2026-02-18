"use client";

import type {
	LogicRule,
	Question,
	Survey,
	SurveySettings,
} from "@orksys-survey/db";
import { createContext, useContext } from "react";

interface SurveyOrganization {
	id: string;
	name: string;
	slug: string;
	logo: string | null;
}

interface SurveyWithOrg extends Omit<Survey, "organization"> {
	organization: SurveyOrganization;
}

import { useRunnerActions } from "./hooks/use-runner-actions";
import { useRunnerState } from "./hooks/use-runner-state";

export type AnswerValue = unknown;

interface SurveyRunnerContextValue {
	// Survey data
	survey: Survey | SurveyWithOrg;
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
	survey: Survey | SurveyWithOrg;
	questions: Question[];
	logicRules?: LogicRule[];
	children: React.ReactNode;
	onComplete?: () => void;
}

export function SurveyRunnerProvider({
	survey,
	questions,
	logicRules = [],
	children,
	onComplete,
}: SurveyRunnerProviderProps) {
	// State management
	const state = useRunnerState({
		survey,
		questions,
		logicRules,
	});

	// Actions
	const actions = useRunnerActions({
		survey,
		visibleQuestions: state.visibleQuestions,
		sortedQuestions: state.sortedQuestions,
		currentQuestionIndex: state.currentQuestionIndex,
		answers: state.answers,
		fingerprint: state.fingerprint,
		setAnswers: state.setAnswers,
		setCurrentQuestionIndex: state.setCurrentQuestionIndex,
		setIsComplete: state.setIsComplete,
		onComplete,
	});

	const value: SurveyRunnerContextValue = {
		survey: state.survey,
		questions: state.questions,
		settings: state.settings,
		logicRules: state.logicRules as LogicRule[],
		displayMode: state.displayMode,
		answers: state.answers,
		currentQuestionIndex: state.currentQuestionIndex,
		visibleQuestionIds: state.visibleQuestionIds,
		visibleQuestions: state.visibleQuestions,
		canGoBack: state.canGoBack,
		canGoNext: state.canGoNext,
		isComplete: state.isComplete,
		isSubmitting: actions.isSubmitting,
		setAnswer: actions.setAnswer,
		goNext: actions.goNext,
		goBack: actions.goBack,
		submit: actions.submit,
		validateAllQuestions: actions.validateAllQuestions,
		fingerprint: state.fingerprint,
		currentError: actions.currentError,
		clearError: actions.clearError,
	};

	return (
		<SurveyRunnerContext.Provider value={value}>
			{children}
		</SurveyRunnerContext.Provider>
	);
}
