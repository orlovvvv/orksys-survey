"use client";

import type { Question, RuleSet } from "@orksys-survey/db";

import type React from "react";
import { createContext, useContext, useMemo } from "react";

interface QuestionContextValue {
	question: Question;
	value: any;
	onChange: (value: any) => void;
	error: string | null;
	ruleSet?: RuleSet | null;
}

const QuestionContext = createContext<QuestionContextValue | null>(null);

export function useQuestion() {
	const context = useContext(QuestionContext);
	if (!context) {
		throw new Error("useQuestion must be used within a QuestionProvider");
	}
	return context;
}

interface QuestionProviderProps {
	question: Question;
	value: any;
	onChange: (value: any) => void;
	error: string | null;
	ruleSet?: RuleSet | null;
	children: React.ReactNode;
}

export function QuestionProvider({
	question,
	value,
	onChange,
	error,
	ruleSet,
	children,
}: QuestionProviderProps) {
	const contextValue = useMemo(
		() => ({
			question,
			value,
			onChange,
			error,
			ruleSet,
		}),
		[question, value, onChange, error, ruleSet],
	);

	return (
		<QuestionContext.Provider value={contextValue}>
			{children}
		</QuestionContext.Provider>
	);
}
