"use client";

import type { Question } from "@orksys-survey/db";
import { assign, setup } from "xstate";

import type { DragItem, SurveyWithOrganization } from "../types";
import { createMockQuestion } from "../utils";

export interface PendingQuestion extends Question {
	insertIndex: number;
}

export interface SurveyBuilderContext {
	survey: SurveyWithOrganization;
	questions: Question[];
	originalQuestions: Question[];
	selectedQuestionId: string | null;
	activeTab: "build" | "preview" | "share";
	paletteOpen: boolean;
	propertiesOpen: boolean;
	settingsOpen: boolean;
	activeDragItem: DragItem | null;
	overId: string | null;
	pendingQuestion: PendingQuestion | null;
	isDirty: boolean;
	error: string | null;
}

export type SurveyBuilderEvent =
	| {
			type: "QUESTION_ADD";
			questionType: Question["type"];
			insertIndex?: number;
	  }
	| { type: "QUESTION_UPDATE"; id: string; updates: Partial<Question> }
	| { type: "QUESTION_DELETE"; id: string }
	| { type: "QUESTION_REORDER"; oldIndex: number; newIndex: number }
	| { type: "QUESTION_DUPLICATE"; id: string }
	| { type: "QUESTIONS_SET"; questions: Question[] }
	| { type: "SAVE" }
	| { type: "SAVE_SUCCESS"; questions: Question[] }
	| { type: "SAVE_ERROR"; error: string }
	| { type: "PUBLISH" }
	| { type: "PUBLISH_SUCCESS" }
	| { type: "PUBLISH_ERROR"; error: string }
	| { type: "DISCARD_CHANGES" }
	| { type: "SELECT_QUESTION"; id: string | null }
	| { type: "SET_DRAG_ITEM"; item: DragItem | null }
	| { type: "SET_OVER_ID"; id: string | null }
	| { type: "DRAG_PREVIEW_START"; questionType: Question["type"] }
	| { type: "DRAG_PREVIEW_MOVE"; insertIndex: number }
	| { type: "DRAG_PREVIEW_COMMIT" }
	| { type: "DRAG_PREVIEW_CANCEL" }
	| { type: "DRAG_REORDER_COMMIT"; oldIndex: number; newIndex: number }
	| { type: "SET_TAB"; tab: "build" | "preview" | "share" }
	| { type: "TOGGLE_PALETTE"; open?: boolean }
	| { type: "TOGGLE_PROPERTIES"; open?: boolean }
	| { type: "TOGGLE_SETTINGS"; open?: boolean }
	| { type: "UPDATE_SURVEY_STATUS"; status: string }
	| { type: "CLEAR_ERROR" };

export function createSurveyBuilderMachine(
	survey: SurveyWithOrganization,
	initialQuestions: Question[],
) {
	return setup({
		types: {
			context: {} as SurveyBuilderContext,
			events: {} as SurveyBuilderEvent,
		},
	}).createMachine({
		id: "surveyBuilder",
		initial: "idle",
		context: {
			survey,
			questions: initialQuestions,
			originalQuestions: initialQuestions,
			selectedQuestionId: null,
			activeTab: "build" as const,
			paletteOpen: false,
			propertiesOpen: false,
			settingsOpen: false,
			activeDragItem: null,
			overId: null,
			pendingQuestion: null,
			isDirty: false,
			error: null,
		},
		states: {
			idle: {
				on: {
					QUESTION_ADD: {
						target: "dirty",
						actions: assign({
							questions: ({ context, event }) => {
								if (event.type !== "QUESTION_ADD") return context.questions;
								const { questionType, insertIndex } = event;
								const newQuestion = createMockQuestion(questionType);
								const id = `temp-${crypto.randomUUID()}`;
								const finalQuestion = {
									...newQuestion,
									id,
									surveyId: context.survey.id,
								};
								const index = insertIndex ?? context.questions.length;
								const newList = [...context.questions];
								newList.splice(index, 0, finalQuestion);
								return newList.map((q: Question, i: number) => ({
									...q,
									order: i,
								}));
							},
						}),
					},
					QUESTION_UPDATE: {
						target: "dirty",
						actions: assign({
							questions: ({ context, event }) => {
								if (event.type !== "QUESTION_UPDATE") return context.questions;
								return context.questions.map((q: Question) =>
									q.id === event.id
										? ({ ...q, ...event.updates } as Question)
										: q,
								);
							},
						}),
					},
					QUESTION_DELETE: {
						target: "dirty",
						actions: assign({
							questions: ({ context, event }) => {
								if (event.type !== "QUESTION_DELETE") return context.questions;
								const newList = context.questions.filter(
									(q: Question) => q.id !== event.id,
								);
								return newList.map((q: Question, i: number) => ({
									...q,
									order: i,
								}));
							},
							selectedQuestionId: ({ context, event }) => {
								if (event.type !== "QUESTION_DELETE")
									return context.selectedQuestionId;
								return context.selectedQuestionId === event.id
									? null
									: context.selectedQuestionId;
							},
						}),
					},
					QUESTION_REORDER: {
						target: "dirty",
						actions: assign({
							questions: ({ context, event }) => {
								if (event.type !== "QUESTION_REORDER") return context.questions;
								const { oldIndex, newIndex } = event;
								if (oldIndex === newIndex) return context.questions;
								const newList = [...context.questions];
								const [moved] = newList.splice(oldIndex, 1);
								newList.splice(newIndex, 0, moved);
								return newList.map((q: Question, i: number) => ({
									...q,
									order: i,
								}));
							},
						}),
					},
					QUESTION_DUPLICATE: {
						target: "dirty",
						actions: assign({
							questions: ({ context, event }) => {
								if (event.type !== "QUESTION_DUPLICATE")
									return context.questions;
								const index = context.questions.findIndex(
									(q: Question) => q.id === event.id,
								);
								if (index === -1) return context.questions;
								const original = context.questions[index];
								const duplicatedId = `temp-${crypto.randomUUID()}`;
								const duplicatedQuestion = {
									...original,
									id: duplicatedId,
									title: `${original.title} (Copy)`,
								} as Question;
								const newList = [...context.questions];
								newList.splice(index + 1, 0, duplicatedQuestion);
								return newList.map((q: Question, i: number) => ({
									...q,
									order: i,
								}));
							},
						}),
					},
					QUESTIONS_SET: {
						actions: assign({
							questions: ({ event }) => {
								if (event.type !== "QUESTIONS_SET") return [];
								return event.questions.map((q: Question, i: number) => ({
									...q,
									order: i,
								}));
							},
						}),
					},
					SELECT_QUESTION: {
						actions: assign({ selectedQuestionId: ({ event }) => event.id }),
					},
					SET_DRAG_ITEM: {
						actions: assign({ activeDragItem: ({ event }) => event.item }),
					},
					SET_OVER_ID: {
						actions: assign({ overId: ({ event }) => event.id }),
					},
					DRAG_PREVIEW_START: {
						actions: assign({
							pendingQuestion: ({ context, event }) => {
								if (event.type !== "DRAG_PREVIEW_START") return null;
								const mock = createMockQuestion(event.questionType);
								return {
									...mock,
									id: `preview-${crypto.randomUUID()}`,
									surveyId: context.survey.id,
									insertIndex: context.questions.length,
								} as PendingQuestion;
							},
						}),
					},
					DRAG_PREVIEW_MOVE: {
						actions: assign({
							pendingQuestion: ({ context, event }) => {
								if (
									event.type !== "DRAG_PREVIEW_MOVE" ||
									!context.pendingQuestion
								)
									return context.pendingQuestion;

								// Guard: return same reference if insertIndex unchanged
								if (context.pendingQuestion.insertIndex === event.insertIndex) {
									return context.pendingQuestion;
								}

								return {
									...context.pendingQuestion,
									insertIndex: event.insertIndex,
								};
							},
						}),
					},
					DRAG_PREVIEW_COMMIT: {
						target: "dirty",
						actions: assign(({ context }) => {
							if (!context.pendingQuestion)
								return {
									pendingQuestion: null,
									activeDragItem: null,
									overId: null,
								};

							const newId = `temp-${crypto.randomUUID()}`;
							const { insertIndex, ...questionData } = context.pendingQuestion;
							const newList = [...context.questions];
							newList.splice(insertIndex, 0, {
								...questionData,
								id: newId,
								surveyId: context.survey.id,
							} as Question);

							return {
								questions: newList.map((q, i) => ({ ...q, order: i })),
								selectedQuestionId: newId,
								pendingQuestion: null,
								activeDragItem: null,
								overId: null,
								isDirty: true,
							};
						}),
					},
					DRAG_PREVIEW_CANCEL: {
						actions: assign({
							pendingQuestion: null,
							activeDragItem: null,
							overId: null,
						}),
					},
					DRAG_REORDER_COMMIT: {
						target: "dirty",
						actions: assign(({ context, event }) => {
							if (event.type !== "DRAG_REORDER_COMMIT") return {};
							const { oldIndex, newIndex } = event;
							if (oldIndex === newIndex)
								return { activeDragItem: null, overId: null };
							const newList = [...context.questions];
							const [moved] = newList.splice(oldIndex, 1);
							newList.splice(newIndex, 0, moved);
							return {
								questions: newList.map((q, i) => ({ ...q, order: i })),
								activeDragItem: null,
								overId: null,
								isDirty: true,
							};
						}),
					},
					SET_TAB: {
						actions: assign({ activeTab: ({ event }) => event.tab }),
					},
					TOGGLE_PALETTE: {
						actions: assign({
							paletteOpen: ({ context, event }) =>
								event.open ?? !context.paletteOpen,
						}),
					},
					TOGGLE_PROPERTIES: {
						actions: assign({
							propertiesOpen: ({ context, event }) =>
								event.open ?? !context.propertiesOpen,
						}),
					},
					TOGGLE_SETTINGS: {
						actions: assign({
							settingsOpen: ({ context, event }) =>
								event.open ?? !context.settingsOpen,
						}),
					},
					UPDATE_SURVEY_STATUS: {
						actions: assign({
							survey: ({ context, event }) => {
								if (event.type !== "UPDATE_SURVEY_STATUS")
									return context.survey;
								return {
									...context.survey,
									status: event.status,
								} as SurveyWithOrganization;
							},
						}),
					},
					CLEAR_ERROR: {
						actions: assign({ error: () => null }),
					},
				},
			},
			dirty: {
				on: {
					QUESTION_ADD: {
						actions: assign({
							questions: ({ context, event }) => {
								if (event.type !== "QUESTION_ADD") return context.questions;
								const { questionType, insertIndex } = event;
								const newQuestion = createMockQuestion(questionType);
								const id = `temp-${crypto.randomUUID()}`;
								const finalQuestion = {
									...newQuestion,
									id,
									surveyId: context.survey.id,
								};
								const index = insertIndex ?? context.questions.length;
								const newList = [...context.questions];
								newList.splice(index, 0, finalQuestion);
								return newList.map((q: Question, i: number) => ({
									...q,
									order: i,
								}));
							},
						}),
					},
					QUESTION_UPDATE: {
						actions: assign({
							questions: ({ context, event }) => {
								if (event.type !== "QUESTION_UPDATE") return context.questions;
								return context.questions.map((q: Question) =>
									q.id === event.id
										? ({ ...q, ...event.updates } as Question)
										: q,
								);
							},
						}),
					},
					QUESTION_DELETE: {
						actions: assign({
							questions: ({ context, event }) => {
								if (event.type !== "QUESTION_DELETE") return context.questions;
								const newList = context.questions.filter(
									(q: Question) => q.id !== event.id,
								);
								return newList.map((q: Question, i: number) => ({
									...q,
									order: i,
								}));
							},
							selectedQuestionId: ({ context, event }) => {
								if (event.type !== "QUESTION_DELETE")
									return context.selectedQuestionId;
								return context.selectedQuestionId === event.id
									? null
									: context.selectedQuestionId;
							},
						}),
					},
					QUESTION_REORDER: {
						actions: assign({
							questions: ({ context, event }) => {
								if (event.type !== "QUESTION_REORDER") return context.questions;
								const { oldIndex, newIndex } = event;
								if (oldIndex === newIndex) return context.questions;
								const newList = [...context.questions];
								const [moved] = newList.splice(oldIndex, 1);
								newList.splice(newIndex, 0, moved);
								return newList.map((q: Question, i: number) => ({
									...q,
									order: i,
								}));
							},
						}),
					},
					QUESTION_DUPLICATE: {
						actions: assign({
							questions: ({ context, event }) => {
								if (event.type !== "QUESTION_DUPLICATE")
									return context.questions;
								const index = context.questions.findIndex(
									(q: Question) => q.id === event.id,
								);
								if (index === -1) return context.questions;
								const original = context.questions[index];
								const duplicatedId = `temp-${crypto.randomUUID()}`;
								const duplicatedQuestion = {
									...original,
									id: duplicatedId,
									title: `${original.title} (Copy)`,
								} as Question;
								const newList = [...context.questions];
								newList.splice(index + 1, 0, duplicatedQuestion);
								return newList.map((q: Question, i: number) => ({
									...q,
									order: i,
								}));
							},
						}),
					},
					QUESTIONS_SET: {
						actions: assign({
							questions: ({ event }) => {
								if (event.type !== "QUESTIONS_SET") return [];
								return event.questions.map((q: Question, i: number) => ({
									...q,
									order: i,
								}));
							},
						}),
					},
					SAVE: "saving",
					DISCARD_CHANGES: {
						target: "idle",
						actions: assign({
							questions: ({ context }) => context.originalQuestions,
							isDirty: () => false,
							error: () => null,
							selectedQuestionId: () => null,
						}),
					},
					SELECT_QUESTION: {
						actions: assign({ selectedQuestionId: ({ event }) => event.id }),
					},
					SET_DRAG_ITEM: {
						actions: assign({ activeDragItem: ({ event }) => event.item }),
					},
					SET_OVER_ID: {
						actions: assign({ overId: ({ event }) => event.id }),
					},
					DRAG_PREVIEW_START: {
						actions: assign({
							pendingQuestion: ({ context, event }) => {
								if (event.type !== "DRAG_PREVIEW_START") return null;
								const mock = createMockQuestion(event.questionType);
								return {
									...mock,
									id: `preview-${crypto.randomUUID()}`,
									surveyId: context.survey.id,
									insertIndex: context.questions.length,
								} as PendingQuestion;
							},
						}),
					},
					DRAG_PREVIEW_MOVE: {
						actions: assign({
							pendingQuestion: ({ context, event }) => {
								if (
									event.type !== "DRAG_PREVIEW_MOVE" ||
									!context.pendingQuestion
								)
									return context.pendingQuestion;

								// Guard: return same reference if insertIndex unchanged
								if (context.pendingQuestion.insertIndex === event.insertIndex) {
									return context.pendingQuestion;
								}

								return {
									...context.pendingQuestion,
									insertIndex: event.insertIndex,
								};
							},
						}),
					},
					DRAG_PREVIEW_COMMIT: {
						actions: assign(({ context }) => {
							if (!context.pendingQuestion)
								return {
									pendingQuestion: null,
									activeDragItem: null,
									overId: null,
								};

							const newId = `temp-${crypto.randomUUID()}`;
							const { insertIndex, ...questionData } = context.pendingQuestion;
							const newList = [...context.questions];
							newList.splice(insertIndex, 0, {
								...questionData,
								id: newId,
								surveyId: context.survey.id,
							} as Question);

							return {
								questions: newList.map((q, i) => ({ ...q, order: i })),
								selectedQuestionId: newId,
								pendingQuestion: null,
								activeDragItem: null,
								overId: null,
							};
						}),
					},
					DRAG_PREVIEW_CANCEL: {
						actions: assign({
							pendingQuestion: null,
							activeDragItem: null,
							overId: null,
						}),
					},
					DRAG_REORDER_COMMIT: {
						actions: assign(({ context, event }) => {
							if (event.type !== "DRAG_REORDER_COMMIT") return {};
							const { oldIndex, newIndex } = event;
							if (oldIndex === newIndex)
								return { activeDragItem: null, overId: null };
							const newList = [...context.questions];
							const [moved] = newList.splice(oldIndex, 1);
							newList.splice(newIndex, 0, moved);
							return {
								questions: newList.map((q, i) => ({ ...q, order: i })),
								activeDragItem: null,
								overId: null,
							};
						}),
					},
					SET_TAB: {
						actions: assign({ activeTab: ({ event }) => event.tab }),
					},
					TOGGLE_PALETTE: {
						actions: assign({
							paletteOpen: ({ context, event }) =>
								event.open ?? !context.paletteOpen,
						}),
					},
					TOGGLE_PROPERTIES: {
						actions: assign({
							propertiesOpen: ({ context, event }) =>
								event.open ?? !context.propertiesOpen,
						}),
					},
					TOGGLE_SETTINGS: {
						actions: assign({
							settingsOpen: ({ context, event }) =>
								event.open ?? !context.settingsOpen,
						}),
					},
					UPDATE_SURVEY_STATUS: {
						actions: assign({
							survey: ({ context, event }) => {
								if (event.type !== "UPDATE_SURVEY_STATUS")
									return context.survey;
								return {
									...context.survey,
									status: event.status,
								} as SurveyWithOrganization;
							},
						}),
					},
					CLEAR_ERROR: {
						actions: assign({ error: () => null }),
					},
				},
			},
			saving: {
				on: {
					SAVE_SUCCESS: {
						target: "saved",
						actions: assign({
							isDirty: () => false,
							originalQuestions: ({ context }) => context.questions,
							error: () => null,
						}),
					},
					SAVE_ERROR: {
						target: "error",
						actions: assign({
							error: ({ event }) => {
								if ("error" in event) return event.error;
								return "An error occurred";
							},
						}),
					},
				},
			},
			saved: {
				on: {
					QUESTION_ADD: {
						target: "dirty",
						actions: assign({
							questions: ({ context, event }) => {
								if (event.type !== "QUESTION_ADD") return context.questions;
								const { questionType, insertIndex } = event;
								const newQuestion = createMockQuestion(questionType);
								const id = `temp-${crypto.randomUUID()}`;
								const finalQuestion = {
									...newQuestion,
									id,
									surveyId: context.survey.id,
								};
								const index = insertIndex ?? context.questions.length;
								const newList = [...context.questions];
								newList.splice(index, 0, finalQuestion);
								return newList.map((q: Question, i: number) => ({
									...q,
									order: i,
								}));
							},
						}),
					},
					QUESTION_UPDATE: {
						target: "dirty",
						actions: assign({
							questions: ({ context, event }) => {
								if (event.type !== "QUESTION_UPDATE") return context.questions;
								return context.questions.map((q: Question) =>
									q.id === event.id
										? ({ ...q, ...event.updates } as Question)
										: q,
								);
							},
						}),
					},
					QUESTION_DELETE: {
						target: "dirty",
						actions: assign({
							questions: ({ context, event }) => {
								if (event.type !== "QUESTION_DELETE") return context.questions;
								const newList = context.questions.filter(
									(q: Question) => q.id !== event.id,
								);
								return newList.map((q: Question, i: number) => ({
									...q,
									order: i,
								}));
							},
							selectedQuestionId: ({ context, event }) => {
								if (event.type !== "QUESTION_DELETE")
									return context.selectedQuestionId;
								return context.selectedQuestionId === event.id
									? null
									: context.selectedQuestionId;
							},
						}),
					},
					QUESTION_REORDER: {
						target: "dirty",
						actions: assign({
							questions: ({ context, event }) => {
								if (event.type !== "QUESTION_REORDER") return context.questions;
								const { oldIndex, newIndex } = event;
								if (oldIndex === newIndex) return context.questions;
								const newList = [...context.questions];
								const [moved] = newList.splice(oldIndex, 1);
								newList.splice(newIndex, 0, moved);
								return newList.map((q: Question, i: number) => ({
									...q,
									order: i,
								}));
							},
						}),
					},
					QUESTION_DUPLICATE: {
						target: "dirty",
						actions: assign({
							questions: ({ context, event }) => {
								if (event.type !== "QUESTION_DUPLICATE")
									return context.questions;
								const index = context.questions.findIndex(
									(q: Question) => q.id === event.id,
								);
								if (index === -1) return context.questions;
								const original = context.questions[index];
								const duplicatedId = `temp-${crypto.randomUUID()}`;
								const duplicatedQuestion = {
									...original,
									id: duplicatedId,
									title: `${original.title} (Copy)`,
								} as Question;
								const newList = [...context.questions];
								newList.splice(index + 1, 0, duplicatedQuestion);
								return newList.map((q: Question, i: number) => ({
									...q,
									order: i,
								}));
							},
						}),
					},
					QUESTIONS_SET: {
						target: "dirty",
						actions: assign({
							questions: ({ event }) => {
								if (event.type !== "QUESTIONS_SET") return [];
								return event.questions.map((q: Question, i: number) => ({
									...q,
									order: i,
								}));
							},
						}),
					},
					PUBLISH: {
						target: "publishing",
						guard: ({ context }) => context.survey.status === "draft",
					},
					SELECT_QUESTION: {
						actions: assign({ selectedQuestionId: ({ event }) => event.id }),
					},
					SET_DRAG_ITEM: {
						actions: assign({ activeDragItem: ({ event }) => event.item }),
					},
					SET_OVER_ID: {
						actions: assign({ overId: ({ event }) => event.id }),
					},
					DRAG_PREVIEW_START: {
						actions: assign({
							pendingQuestion: ({ context, event }) => {
								if (event.type !== "DRAG_PREVIEW_START") return null;
								const mock = createMockQuestion(event.questionType);
								return {
									...mock,
									id: `preview-${crypto.randomUUID()}`,
									surveyId: context.survey.id,
									insertIndex: context.questions.length,
								} as PendingQuestion;
							},
						}),
					},
					DRAG_PREVIEW_MOVE: {
						actions: assign({
							pendingQuestion: ({ context, event }) => {
								if (
									event.type !== "DRAG_PREVIEW_MOVE" ||
									!context.pendingQuestion
								)
									return context.pendingQuestion;

								// Guard: return same reference if insertIndex unchanged
								if (context.pendingQuestion.insertIndex === event.insertIndex) {
									return context.pendingQuestion;
								}

								return {
									...context.pendingQuestion,
									insertIndex: event.insertIndex,
								};
							},
						}),
					},
					DRAG_PREVIEW_COMMIT: {
						target: "dirty",
						actions: assign(({ context }) => {
							if (!context.pendingQuestion)
								return {
									pendingQuestion: null,
									activeDragItem: null,
									overId: null,
								};

							const newId = `temp-${crypto.randomUUID()}`;
							const { insertIndex, ...questionData } = context.pendingQuestion;
							const newList = [...context.questions];
							newList.splice(insertIndex, 0, {
								...questionData,
								id: newId,
								surveyId: context.survey.id,
							} as Question);

							return {
								questions: newList.map((q, i) => ({ ...q, order: i })),
								selectedQuestionId: newId,
								pendingQuestion: null,
								activeDragItem: null,
								overId: null,
								isDirty: true,
							};
						}),
					},
					DRAG_PREVIEW_CANCEL: {
						actions: assign({
							pendingQuestion: null,
							activeDragItem: null,
							overId: null,
						}),
					},
					DRAG_REORDER_COMMIT: {
						target: "dirty",
						actions: assign(({ context, event }) => {
							if (event.type !== "DRAG_REORDER_COMMIT") return {};
							const { oldIndex, newIndex } = event;
							if (oldIndex === newIndex)
								return { activeDragItem: null, overId: null };
							const newList = [...context.questions];
							const [moved] = newList.splice(oldIndex, 1);
							newList.splice(newIndex, 0, moved);
							return {
								questions: newList.map((q, i) => ({ ...q, order: i })),
								activeDragItem: null,
								overId: null,
								isDirty: true,
							};
						}),
					},
					SET_TAB: {
						actions: assign({ activeTab: ({ event }) => event.tab }),
					},
					TOGGLE_PALETTE: {
						actions: assign({
							paletteOpen: ({ context, event }) =>
								event.open ?? !context.paletteOpen,
						}),
					},
					TOGGLE_PROPERTIES: {
						actions: assign({
							propertiesOpen: ({ context, event }) =>
								event.open ?? !context.propertiesOpen,
						}),
					},
					TOGGLE_SETTINGS: {
						actions: assign({
							settingsOpen: ({ context, event }) =>
								event.open ?? !context.settingsOpen,
						}),
					},
					UPDATE_SURVEY_STATUS: {
						actions: assign({
							survey: ({ context, event }) => {
								if (event.type !== "UPDATE_SURVEY_STATUS")
									return context.survey;
								return {
									...context.survey,
									status: event.status,
								} as SurveyWithOrganization;
							},
						}),
					},
					CLEAR_ERROR: {
						actions: assign({ error: () => null }),
					},
				},
			},
			publishing: {
				on: {
					PUBLISH_SUCCESS: {
						target: "saved",
						actions: assign({
							survey: ({ context }) =>
								({
									...context.survey,
									status: "published",
								}) as SurveyWithOrganization,
						}),
					},
					PUBLISH_ERROR: {
						target: "saved",
						actions: assign({
							error: ({ event }) => {
								if ("error" in event) return event.error;
								return "An error occurred";
							},
						}),
					},
				},
			},
			error: {
				on: {
					SAVE: "saving",
					DISCARD_CHANGES: {
						target: "idle",
						actions: assign({
							questions: ({ context }) => context.originalQuestions,
							isDirty: () => false,
							error: () => null,
							selectedQuestionId: () => null,
						}),
					},
					CLEAR_ERROR: {
						target: "idle",
						actions: assign({ error: () => null }),
					},
				},
			},
		},
	});
}

export type SurveyBuilderMachine = ReturnType<
	typeof createSurveyBuilderMachine
>;
