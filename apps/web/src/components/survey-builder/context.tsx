"use client";

import type { Question } from "@orksys-survey/db";
import { useActorRef, useSelector } from "@xstate/react";
import { createContext, type ReactNode, useContext, useMemo } from "react";
import type { AnyActorRef } from "xstate";
import {
	createSurveyBuilderMachine,
	type SurveyBuilderContext as MachineContext,
	type SurveyBuilderEvent,
} from "./machines/survey-builder-machine";
import type { SurveyWithOrganization } from "./types";

// Re-export types
export type { SurveyBuilderEvent };
export type { MachineContext as SurveyBuilderMachineContext };

export interface SurveyBuilderProviderProps {
	survey: SurveyWithOrganization;
	initialQuestions: Question[];
	children: ReactNode;
}

// Create a React context for the actor
const ActorContext = createContext<AnyActorRef | null>(null);

export function SurveyBuilderProvider({
	survey,
	initialQuestions,
	children,
}: SurveyBuilderProviderProps) {
	const machine = useMemo(
		() => createSurveyBuilderMachine(survey, initialQuestions),
		[survey, initialQuestions],
	);

	const actorRef = useActorRef(machine as any);

	return (
		<ActorContext.Provider value={actorRef}>{children}</ActorContext.Provider>
	);
}

// Hook to get the actor ref
export function useSurveyBuilderActor() {
	const actorRef = useContext(ActorContext);
	if (!actorRef) {
		throw new Error(
			"useSurveyBuilderActor must be used within a SurveyBuilderProvider",
		);
	}
	return actorRef as AnyActorRef;
}

// Selector hook with proper typing
export function useSurveyBuilderSelector<T>(
	selector: (snapshot: { context: MachineContext; value: string }) => T,
	equalityFn?: (a: T, b: T) => boolean,
): T {
	const actorRef = useSurveyBuilderActor();
	// Cast to any to bypass the strict type checking from XState
	return useSelector(actorRef as any, selector as any, equalityFn) as T;
}

// Convenience object for the context
export const SurveyBuilderContext = {
	useActorRef: useSurveyBuilderActor,
	useSelector: useSurveyBuilderSelector,
};

// Alias for backward compatibility
export const useSurveyBuilder = useSurveyBuilderSelector;

// Legacy hook for backward compatibility
export function useSurveyBuilderLegacy() {
	const actorRef = useSurveyBuilderActor();
	const snapshot = useSelector(actorRef as any, (s: any) => s) as {
		context: MachineContext;
		value: string;
	};

	return {
		actorRef,
		send: actorRef.send,
		state: {
			survey: snapshot.context.survey,
			questions: snapshot.context.questions,
			selectedQuestionId: snapshot.context.selectedQuestionId,
			activeTab: snapshot.context.activeTab,
			paletteOpen: snapshot.context.paletteOpen,
			propertiesOpen: snapshot.context.propertiesOpen,
			settingsOpen: snapshot.context.settingsOpen,
			activeDragItem: snapshot.context.activeDragItem,
			overId: snapshot.context.overId,
			isDirty: snapshot.context.isDirty,
			error: snapshot.context.error,
		},
		machineState: snapshot.value,
	};
}
