"use client";

import type { Question } from "@orksys-survey/db";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { orpc } from "@/utils/orpc";
import { useSurveyRunner } from "../context";
import { ChoiceQuestion } from "./choice-question";
import { DatePickerQuestion } from "./date-picker-question";
import { DropdownQuestion } from "./dropdown-question";
import { FileUploadQuestion } from "./file-upload";
import { LongTextQuestion } from "./long-text-question";
import { QuestionProvider, useQuestion } from "./question-context";
import { NpsQuestion, RatingQuestion } from "./rating-question";
import { SliderQuestion } from "./slider-question";
import { TextQuestion } from "./text-question";

export interface QuestionRendererProps {
	question: Question;
}

interface QuestionContextValue {
	answers: Map<string, unknown>;
	setAnswer: (questionId: string, value: unknown) => void;
	currentError: string | null;
}

export const PreviewContext = createContext<QuestionContextValue | null>(null);

function useQuestionContext(): QuestionContextValue {
	const previewContext = useContext(PreviewContext);
	if (previewContext) {
		return previewContext;
	}
	return useSurveyRunner();
}

export function QuestionRenderer({ question }: QuestionRendererProps) {
	const { answers, setAnswer, currentError } = useQuestionContext();
	const value = answers.get(question.id);

	const ruleSetQuery = useQuery(
		orpc.ruleSet.get.queryOptions({
			input: { id: question.ruleSetId || "" },
			enabled: !!question.ruleSetId,
		}),
	);

	return (
		<QuestionProvider
			question={question}
			value={value}
			onChange={(v) => setAnswer(question.id, v)}
			error={currentError}
			ruleSet={ruleSetQuery.data}
		>
			<QuestionSwitcher />
		</QuestionProvider>
	);
}

function QuestionSwitcher() {
	const { question } = useQuestion();

	switch (question.type) {
		case "text":
		case "input":
		case "email":
		case "phone":
			return <TextQuestion />;
		case "long_text":
		case "textarea":
			return <LongTextQuestion />;
		case "choice":
		case "radio_group":
		case "checkbox_group":
		case "multiple_choice":
		case "checkbox":
			return <ChoiceQuestion />;
		case "dropdown":
		case "select":
		case "combobox":
			return <DropdownQuestion />;
		case "rating":
			return <RatingQuestion />;
		case "nps":
			return <NpsQuestion />;
		case "date":
		case "date_picker":
			return <DatePickerQuestion />;
		case "slider":
		case "linear_scale":
			return <SliderQuestion />;
		case "file_upload":
			return <FileUploadQuestion />;
		default:
			return (
				<div className="text-muted-foreground">
					Unknown question type: {question.type}
				</div>
			);
	}
}

export { ChoiceQuestion } from "./choice-question";
export { DatePickerQuestion } from "./date-picker-question";
export { DropdownQuestion } from "./dropdown-question";
export { FileUploadQuestion } from "./file-upload";
export { LongTextQuestion } from "./long-text-question";
export { QuestionProvider, useQuestion } from "./question-context";
export { QuestionField } from "./question-field";
export {
	LinearScaleQuestion,
	NpsQuestion,
	RatingQuestion,
} from "./rating-question";
export { SliderQuestion } from "./slider-question";
export { TextQuestion } from "./text-question";
