"use client";

import type { Question } from "@orksys-survey/db";
import { createContext, useContext } from "react";
import { useSurveyRunner } from "../context";
import { CheckboxQuestion, ChoiceQuestion } from "./choice-question";
import { EmailQuestion, PhoneQuestion } from "./contact-question";
import { DateQuestion } from "./date-question";
import { DropdownQuestion } from "./dropdown-question";
import { FileUploadQuestion } from "./file-upload-question";
import {
	LinearScaleQuestion,
	NpsQuestion,
	RatingQuestion,
} from "./rating-question";
import { TextQuestion } from "./text-question";
import { TextareaQuestion } from "./textarea-question";

export interface QuestionRendererProps {
	question: Question;
}

interface QuestionContextValue {
	answers: Map<string, unknown>;
	setAnswer: (questionId: string, value: unknown) => void;
	currentError: string | null;
}

// Optional preview context - will be undefined in survey runner mode
export const PreviewContext = createContext<QuestionContextValue | null>(null);

function useQuestionContext(): QuestionContextValue {
	// Check for preview context first
	const previewContext = useContext(PreviewContext);
	if (previewContext) {
		return previewContext;
	}
	// Fall back to survey runner context
	return useSurveyRunner();
}

export function QuestionRenderer({ question }: QuestionRendererProps) {
	const { answers, setAnswer, currentError } = useQuestionContext();
	const value = answers.get(question.id);
	const error = currentError;

	const handleChange = (newValue: unknown) => {
		setAnswer(question.id, newValue);
	};

	switch (question.type) {
		case "text":
			return (
				<TextQuestion
					question={question}
					value={value as string | undefined}
					onChange={(v) => handleChange(v)}
					error={error}
				/>
			);
		case "textarea":
			return (
				<TextareaQuestion
					question={question}
					value={value as string | undefined}
					onChange={(v) => handleChange(v)}
					error={error}
				/>
			);
		case "multiple_choice":
			return (
				<ChoiceQuestion
					question={question}
					value={value as string | undefined}
					onChange={(v) => handleChange(v)}
					error={error}
				/>
			);
		case "checkbox":
			return (
				<CheckboxQuestion
					question={question}
					value={value as string[] | undefined}
					onChange={(v) => handleChange(v)}
					error={error}
				/>
			);
		case "dropdown":
			return (
				<DropdownQuestion
					question={question}
					value={value as string | undefined}
					onChange={(v) => handleChange(v)}
					error={error}
				/>
			);
		case "rating":
			return (
				<RatingQuestion
					question={question}
					value={value as number | undefined}
					onChange={(v) => handleChange(v)}
					error={error}
				/>
			);
		case "nps":
			return (
				<NpsQuestion
					question={question}
					value={value as number | undefined}
					onChange={(v) => handleChange(v)}
					error={error}
				/>
			);
		case "linear_scale":
			return (
				<LinearScaleQuestion
					question={question}
					value={value as number | undefined}
					onChange={(v) => handleChange(v)}
					error={error}
				/>
			);
		case "date":
			return (
				<DateQuestion
					question={question}
					value={value as string | undefined}
					onChange={(v) => handleChange(v)}
					error={error}
				/>
			);
		case "email":
			return (
				<EmailQuestion
					question={question}
					value={value as string | undefined}
					onChange={(v) => handleChange(v)}
					error={error}
				/>
			);
		case "phone":
			return (
				<PhoneQuestion
					question={question}
					value={value as string | undefined}
					onChange={(v) => handleChange(v)}
					error={error}
				/>
			);
		case "file_upload":
			return (
				<FileUploadQuestion
					question={question}
					value={value}
					onChange={handleChange}
					error={error}
				/>
			);
		default:
			return (
				<div className="text-muted-foreground">
					Unknown question type: {question.type}
				</div>
			);
	}
}

// Barrel exports for backward compatibility
export { CheckboxQuestion, ChoiceQuestion } from "./choice-question";
export { EmailQuestion, PhoneQuestion } from "./contact-question";
export { DateQuestion } from "./date-question";
export { DropdownQuestion } from "./dropdown-question";
export { FileUploadQuestion } from "./file-upload-question";
export { QuestionField } from "./question-field";
export {
	LinearScaleQuestion,
	NpsQuestion,
	RatingQuestion,
} from "./rating-question";
export { TextQuestion } from "./text-question";
export { TextareaQuestion } from "./textarea-question";
export type {
	ArrayQuestionProps,
	BaseQuestionProps,
	NumberQuestionProps,
	TextQuestionProps,
} from "./types";
