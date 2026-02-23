"use client";

import type { Question } from "@orksys-survey/db";

import type { SurveyBuilderContext as MachineContext } from "../machines/survey-builder-machine";

// Type for the snapshot from XState
type Snapshot = { context: MachineContext; value: string };

// Selector functions - each extracts a specific slice of state
export const selectQuestions = (snapshot: Snapshot): Question[] =>
	snapshot.context.questions;

export const selectSelectedQuestionId = (snapshot: Snapshot): string | null =>
	snapshot.context.selectedQuestionId;

export const selectIsDirty = (snapshot: Snapshot): boolean =>
	snapshot.context.isDirty;

export const selectSurvey = (snapshot: Snapshot) => snapshot.context.survey;

export const selectActiveTab = (
	snapshot: Snapshot,
): "build" | "preview" | "share" => snapshot.context.activeTab;

export const selectPaletteOpen = (snapshot: Snapshot): boolean =>
	snapshot.context.paletteOpen;

export const selectPropertiesOpen = (snapshot: Snapshot): boolean =>
	snapshot.context.propertiesOpen;

export const selectSettingsOpen = (snapshot: Snapshot): boolean =>
	snapshot.context.settingsOpen;

export const selectDragState = (snapshot: Snapshot) => ({
	activeDragItem: snapshot.context.activeDragItem,
	overId: snapshot.context.overId,
});

export const selectMachineState = (snapshot: Snapshot): string =>
	snapshot.value;

export const selectError = (snapshot: Snapshot): string | null =>
	snapshot.context.error;

// Comparison functions for optimizing re-renders
export const questionsEqual = (a: Question[], b: Question[]): boolean => {
	if (a.length !== b.length) return false;
	return a.every((q, i) => q.id === b[i]?.id && q.order === b[i]?.order);
};

export const dragStateEqual = (
	a: { activeDragItem: unknown; overId: string | null },
	b: { activeDragItem: unknown; overId: string | null },
): boolean => {
	return a.activeDragItem === b.activeDragItem && a.overId === b.overId;
};
