"use client";

import { useState } from "react";
import { PreviewContext } from "@/components/survey-runner/questions";

interface PreviewProviderProps {
	children: React.ReactNode;
}

export function PreviewProvider({ children }: PreviewProviderProps) {
	const [answers, setAnswers] = useState<Map<string, unknown>>(new Map());

	const setAnswer = (questionId: string, value: unknown) => {
		setAnswers((prev) => {
			const next = new Map(prev);
			next.set(questionId, value);
			return next;
		});
	};

	// No validation errors in preview mode
	const currentError: string | null = null;

	return (
		<PreviewContext.Provider value={{ answers, setAnswer, currentError }}>
			{children}
		</PreviewContext.Provider>
	);
}
