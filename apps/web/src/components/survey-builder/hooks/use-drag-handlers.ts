"use client";

import {
	type CollisionDetection,
	closestCenter,
	type DragEndEvent,
	type DragOverEvent,
	type DragStartEvent,
	pointerWithin,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { Question, Survey } from "@orksys-survey/db";
import { useState } from "react";
import { toast } from "sonner";

import { client } from "@/utils/orpc";
import type { DragItem } from "../types";
import { createMockQuestion, questionTypeLabels } from "../utils";

export interface UseDragHandlersParams {
	questions: Question[];
	setQuestions: (
		questions: Question[] | ((prev: Question[]) => Question[]),
	) => void;
	survey: Survey;
	selectedQuestionId: string | null;
	setSelectedQuestionId: (
		id: string | null | ((prev: string | null) => string | null),
	) => void;
	reorderMutation: ReturnType<
		typeof import("./use-question-mutations").useQuestionMutations
	>["reorderMutation"];
}

export function useDragHandlers({
	questions,
	setQuestions,
	survey,
	selectedQuestionId,
	setSelectedQuestionId,
	reorderMutation,
}: UseDragHandlersParams) {
	const [activeDragItem, setActiveDragItem] = useState<DragItem | null>(null);
	const [overId, setOverId] = useState<string | null>(null);

	// Custom collision detection: pointerWithin for palette drops, closestCenter for canvas reordering
	const collisionDetection: CollisionDetection = (args) => {
		// If dragging from palette (has questionType), use pointerWithin for cross-container drops
		if (args.active.data.current?.questionType) {
			const pointerCollisions = pointerWithin(args);
			if (pointerCollisions.length > 0) {
				return pointerCollisions;
			}
		}
		// For canvas reordering, use closestCenter for better sortable behavior
		return closestCenter(args);
	};

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		const data = active.data.current;

		if (data?.questionType) {
			// Dragging from palette
			setActiveDragItem({
				type: "palette",
				questionType: data.questionType as Question["type"],
			});
		} else {
			// Dragging existing question
			setActiveDragItem({
				type: "question",
				id: active.id as string,
			});
		}
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { over } = event;
		setOverId(over?.id as string | null);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setOverId(null);

		if (!over) {
			setActiveDragItem(null);
			return;
		}

		// Handle cancel drop
		if (over.id === "palette-cancel-zone") {
			setActiveDragItem(null);
			return;
		}

		// Handle palette drop (from question type palette) - use tracked drop index
		if (active.data.current?.questionType) {
			const questionType = active.data.current.questionType as Question["type"];

			// Calculate insert index based on over.id
			const overIndex = questions.findIndex((q) => q.id === over.id);
			const insertIndex = overIndex === -1 ? questions.length : overIndex;

			// Optimistic update
			const tempId = `temp-${crypto.randomUUID()}`;
			const mockQuestion = createMockQuestion(questionType);
			const optimisticQuestion = { ...mockQuestion, id: tempId };

			const optimisticQuestions = [
				...questions.slice(0, insertIndex).map((q, i) => ({ ...q, order: i })),
				{ ...optimisticQuestion, order: insertIndex },
				...questions
					.slice(insertIndex)
					.map((q, i) => ({ ...q, order: insertIndex + 1 + i })),
			];

			setQuestions(optimisticQuestions);
			setSelectedQuestionId(tempId);

			// Create question and reorder
			client.question
				.create({
					surveyId: survey.id,
					type: questionType,
					title: `New ${questionTypeLabels[questionType] || questionType}`,
					order: insertIndex,
				})
				.then((newQuestion) => {
					// Replace optimistic question with real one
					setQuestions((currentQuestions) => {
						const updatedQuestions = currentQuestions.map((q) =>
							q.id === tempId ? newQuestion : q,
						);
						return updatedQuestions;
					});

					setSelectedQuestionId((currentId) =>
						currentId === tempId ? newQuestion.id : currentId,
					);

					// Invalidate queries
					reorderMutation.mutate({
						questions: [
							...questions
								.slice(0, insertIndex)
								.map((q, i) => ({ ...q, order: i })),
							{ ...newQuestion, order: insertIndex },
							...questions
								.slice(insertIndex)
								.map((q, i) => ({ ...q, order: insertIndex + 1 + i })),
						].map((q) => ({
							id: q.id,
							order: q.order,
						})),
					});

					toast.success("Question added");
				})
				.catch((error: Error) => {
					// Revert on error
					setQuestions(questions);
					if (selectedQuestionId === tempId) setSelectedQuestionId(null);
					toast.error(error.message || "Failed to create question");
				});

			setActiveDragItem(null);
			return;
		}

		// Handle reordering
		if (active.id !== over.id && over.id !== "canvas") {
			const oldIndex = questions.findIndex((q) => q.id === active.id);
			const newIndex = questions.findIndex((q) => q.id === over.id);

			if (oldIndex !== -1 && newIndex !== -1) {
				const newQuestions = arrayMove(questions, oldIndex, newIndex).map(
					(q, index) => {
						// Only create new object if order actually changed
						if (q.order === index) {
							return q; // Preserve reference
						}
						return { ...q, order: index };
					},
				);

				setQuestions(newQuestions);

				reorderMutation.mutate({
					questions: newQuestions.map((q) => ({
						id: q.id,
						order: q.order,
					})),
				});
			}
		}

		setActiveDragItem(null); // Always called last
	};

	return {
		activeDragItem,
		overId,
		collisionDetection,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
	};
}
