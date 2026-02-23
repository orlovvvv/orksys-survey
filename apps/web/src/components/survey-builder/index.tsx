"use client";

import {
	DndContext,
	DragOverlay,
	type DropAnimation,
	defaultDropAnimation,
	defaultDropAnimationSideEffects,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { BuilderBottomBar } from "./builder-bottom-bar";
import { BuilderCanvas } from "./builder-canvas";
import { BuilderHeader } from "./builder-header";
import { SurveyBuilderContext, SurveyBuilderProvider } from "./context";
import { DragOverlayRenderer } from "./drag-overlay-renderer";
import { useDragHandlers } from "./hooks/use-drag-handlers";
import { PropertiesPanel } from "./properties-panel";
import { QuestionPalette } from "./question-palette";

const paletteDropAnimation: DropAnimation = {
	...defaultDropAnimation,
	duration: 200,
	keyframes: ({ transform }) => [
		{ opacity: 1, transform: CSS.Transform.toString(transform.initial) },
		{
			opacity: 0,
			transform: CSS.Transform.toString(transform.initial),
		},
	],
};

const sortableDropAnimation: DropAnimation = {
	duration: 250,
	easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
	sideEffects: defaultDropAnimationSideEffects({
		styles: {
			active: {
				opacity: "0.5",
			},
		},
	}),
};

export function SurveyBuilderDndCore({
	children,
}: {
	children: React.ReactNode;
}) {
	const activeDragItem = SurveyBuilderContext.useSelector(
		(s) => s.context.activeDragItem,
	);
	const questions = SurveyBuilderContext.useSelector(
		(s) => s.context.questions,
	);
	const selectedQuestionId = SurveyBuilderContext.useSelector(
		(s) => s.context.selectedQuestionId,
	);

	const { collisionDetection, handleDragStart, handleDragOver, handleDragEnd } =
		useDragHandlers();

	// Cache the drag item so the DragOverlay doesn't lose its animation configuration
	// the instant it is dropped (since activeDragItem becomes null synchronously)
	const activeDragItemRef = useRef(activeDragItem);
	useEffect(() => {
		if (activeDragItem) {
			activeDragItemRef.current = activeDragItem;
		}
	}, [activeDragItem]);

	const currentOrPreviousDragItem = activeDragItem || activeDragItemRef.current;

	const pointerSensorOptions = useMemo(
		() => ({
			activationConstraint: {
				distance: 5,
			},
		}),
		[],
	);
	const keyboardSensorOptions = useMemo(
		() => ({
			coordinateGetter: sortableKeyboardCoordinates,
		}),
		[],
	);

	const pointerSensor = useSensor(PointerSensor, pointerSensorOptions);
	const keyboardSensor = useSensor(KeyboardSensor, keyboardSensorOptions);

	const sensors = useSensors(pointerSensor, keyboardSensor);

	const safeQuestions = questions || [];

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={collisionDetection}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
		>
			{children}
			<DragOverlay
				dropAnimation={
					currentOrPreviousDragItem?.type === "palette"
						? paletteDropAnimation
						: sortableDropAnimation
				}
			>
				<DragOverlayRenderer
					activeDragItem={activeDragItem}
					questions={safeQuestions}
					selectedQuestionId={selectedQuestionId}
				/>
			</DragOverlay>
		</DndContext>
	);
}

export function SurveyBuilderFrame({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("flex h-full flex-col", className)}>{children}</div>
	);
}

export const SurveyBuilder = {
	Provider: SurveyBuilderProvider,
	DndCore: SurveyBuilderDndCore,
	Frame: SurveyBuilderFrame,
	Canvas: BuilderCanvas,
	Palette: QuestionPalette,
	Properties: PropertiesPanel,
	Header: BuilderHeader,
	BottomBar: BuilderBottomBar,
};

export { BuilderBottomBar } from "./builder-bottom-bar";
// Re-export sub-components & hooks for external use
export { BuilderCanvas } from "./builder-canvas";
export { BuilderHeader } from "./builder-header";
export type { TabValue } from "./builder-header/builder-tabs";
export {
	SurveyBuilderContext,
	useSurveyBuilder,
	useSurveyBuilderActor,
	useSurveyBuilderLegacy,
	useSurveyBuilderSelector,
} from "./context";
export { useDragHandlers } from "./hooks/use-drag-handlers";
export { useQuestionMutations } from "./hooks/use-question-mutations";
export { PropertiesPanel } from "./properties-panel";
export { QuestionPalette } from "./question-palette";
export type { DragItem, SurveyBuilderContextValue } from "./types";
