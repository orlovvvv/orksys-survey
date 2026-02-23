"use client";

import {
	type CollisionDetection,
	closestCenter,
	type DragEndEvent,
	type DragOverEvent,
	type DragStartEvent,
	pointerWithin,
} from "@dnd-kit/core";
import type { Question } from "@orksys-survey/db";
import { useCallback, useRef } from "react";

import { SurveyBuilderContext } from "../context";

function calculateInsertIndex(
	questions: Question[],
	overId: string | number,
): number {
	const index = questions.findIndex((q) => q.id === overId);
	return index === -1 ? questions.length : index;
}

export function useDragHandlers() {
	const send = SurveyBuilderContext.useActorRef().send;
	const questions = SurveyBuilderContext.useSelector(
		(s) => s.context.questions,
		(a, b) => a === b,
	);
	const prevInsertIndexRef = useRef<number | null>(null);

	const collisionDetection: CollisionDetection = useCallback((args) => {
		if (args.active.data.current?.questionType) {
			const pointerCollisions = pointerWithin(args);
			if (pointerCollisions.length > 0) {
				return pointerCollisions;
			}
		}
		return closestCenter(args);
	}, []);

	const handleDragStart = useCallback(
		(event: DragStartEvent) => {
			const { active } = event;
			const data = active.data.current;

			if (data?.questionType) {
				send({
					type: "SET_DRAG_ITEM",
					item: {
						type: "palette",
						id: active.id as string,
						questionType: data.questionType as Question["type"],
					},
				});
				send({
					type: "DRAG_PREVIEW_START",
					questionType: data.questionType as Question["type"],
				});
			} else {
				send({
					type: "SET_DRAG_ITEM",
					item: {
						type: "question",
						id: active.id as string,
					},
				});
			}
		},
		[send],
	);

	const handleDragOver = useCallback(
		(event: DragOverEvent) => {
			const { active, over } = event;

			send({ type: "SET_OVER_ID", id: over?.id as string | null });

			if (!over || over.id === "palette-cancel-zone") return;

			if (active.data.current?.questionType) {
				const insertIndex = calculateInsertIndex(questions, over.id);
				// Only send if index actually changed
				if (prevInsertIndexRef.current !== insertIndex) {
					prevInsertIndexRef.current = insertIndex;
					send({ type: "DRAG_PREVIEW_MOVE", insertIndex });
				}
			}
		},
		[send, questions],
	);

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event;

			// Reset insertIndex ref
			prevInsertIndexRef.current = null;

			send({ type: "SET_OVER_ID", id: null });

			const isPaletteDrag = active.data.current?.questionType;

			if (!over || over.id === "palette-cancel-zone") {
				send({
					type: isPaletteDrag ? "DRAG_PREVIEW_CANCEL" : "SET_DRAG_ITEM",
					...(isPaletteDrag ? {} : { item: null }),
				});
				return;
			}

			if (isPaletteDrag) {
				send({ type: "DRAG_PREVIEW_COMMIT" });
				return;
			}

			if (active.id !== over.id && over.id !== "canvas") {
				const oldIndex = questions.findIndex((q) => q.id === active.id);
				const newIndex = questions.findIndex((q) => q.id === over.id);
				if (oldIndex !== -1 && newIndex !== -1) {
					send({ type: "DRAG_REORDER_COMMIT", oldIndex, newIndex });
					return;
				}
			}

			send({ type: "SET_DRAG_ITEM", item: null });
		},
		[send, questions],
	);

	return {
		collisionDetection,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
	};
}
