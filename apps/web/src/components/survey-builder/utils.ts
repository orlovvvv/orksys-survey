import type { Question } from "@orksys-survey/db";
import { questionTypeLabels } from "./question-card";

export function createMockQuestion(type: Question["type"]): Question {
	return {
		id: `temp-${type}`,
		type,
		title: `New ${questionTypeLabels[type] || type}`,
		description: null,
		required: false,
		order: 0,
		surveyId: "temp-survey-id",
		createdAt: new Date(),
		updatedAt: new Date(),
		config: null,
	};
}
