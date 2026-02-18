"use client";

import type { Question } from "@orksys-survey/db";

import { QuestionCardContent } from "./question-card/question-card-content";
import type { DragItem } from "./types";
import { createMockQuestion } from "./utils";

export interface DragOverlayRendererProps {
	activeDragItem: DragItem | null;
	questions: Question[];
	selectedQuestionId: string | null;
}

export function DragOverlayRenderer({
	activeDragItem,
	questions,
	selectedQuestionId,
}: DragOverlayRendererProps) {
	if (!activeDragItem) return null;

	if (activeDragItem.type === "palette") {
		const mockQuestion = createMockQuestion(activeDragItem.questionType);
		return (
			<div className="w-[calc(100vw-3rem)] max-w-2xl">
				<QuestionCardContent
					question={mockQuestion}
					isSelected={false}
					hasLogic={false}
					isOverlay={true}
				/>
			</div>
		);
	}

	// Dragging existing question
	const activeQuestion = questions.find((q) => q.id === activeDragItem.id);
	if (activeQuestion) {
		return (
			<div className="w-[calc(100vw-3rem)] max-w-2xl">
				<QuestionCardContent
					question={activeQuestion}
					isSelected={selectedQuestionId === activeQuestion.id}
					hasLogic={false}
					isOverlay={true}
				/>
			</div>
		);
	}

	return null;
}
