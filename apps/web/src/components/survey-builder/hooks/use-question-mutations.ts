"use client";

import type { Question } from "@orksys-survey/db";

import { SurveyBuilderContext } from "../context";
import { createMockQuestion } from "../utils";

export function useQuestionMutations() {
	const send = SurveyBuilderContext.useActorRef().send;
	const questions = SurveyBuilderContext.useSelector(
		(s) => s.context.questions,
	);
	const selectedQuestionId = SurveyBuilderContext.useSelector(
		(s) => s.context.selectedQuestionId,
	);
	const survey = SurveyBuilderContext.useSelector((s) => s.context.survey);

	const addQuestion = (type: Question["type"], insertIndex?: number) => {
		send({
			type: "QUESTION_ADD",
			questionType: type,
			insertIndex,
		});

		// Return the expected question for consumer use
		const newQuestion = createMockQuestion(type);
		const id = `temp-${crypto.randomUUID()}`;
		return { ...newQuestion, id, surveyId: survey.id };
	};

	const updateQuestion = (id: string, updates: Partial<Question>) => {
		send({ type: "QUESTION_UPDATE", id, updates });
	};

	const deleteQuestion = (id: string) => {
		send({ type: "QUESTION_DELETE", id });
	};

	const duplicateQuestion = (id: string) => {
		send({ type: "QUESTION_DUPLICATE", id });
	};

	return {
		addQuestion,
		updateQuestion,
		deleteQuestion,
		duplicateQuestion,
	};
}
