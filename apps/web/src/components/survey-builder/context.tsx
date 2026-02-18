"use client";

import type { Question } from "@orksys-survey/db";
import { createContext, useContext } from "react";

import type {
	SurveyBuilderContextValue,
	SurveyWithOrganization,
} from "./types";

const SurveyBuilderContext = createContext<SurveyBuilderContextValue | null>(
	null,
);

export interface SurveyBuilderProviderProps {
	survey: SurveyWithOrganization;
	questions: Question[];
	selectedQuestionId: string | null;
	setSelectedQuestionId: (id: string | null) => void;
	activeTab: "build" | "preview" | "share";
	setActiveTab: (tab: "build" | "preview" | "share") => void;
	onQuestionsChange: (questions: Question[]) => void;
	paletteOpen: boolean;
	setPaletteOpen: (open: boolean) => void;
	propertiesOpen: boolean;
	setPropertiesOpen: (open: boolean) => void;
	settingsOpen: boolean;
	setSettingsOpen: (open: boolean) => void;
	children: React.ReactNode;
}

export function SurveyBuilderProvider({
	survey,
	questions,
	selectedQuestionId,
	setSelectedQuestionId,
	activeTab,
	setActiveTab,
	onQuestionsChange,
	paletteOpen,
	setPaletteOpen,
	propertiesOpen,
	setPropertiesOpen,
	settingsOpen,
	setSettingsOpen,
	children,
}: SurveyBuilderProviderProps) {
	const contextValue: SurveyBuilderContextValue = {
		survey,
		questions,
		selectedQuestionId,
		setSelectedQuestionId,
		activeTab,
		setActiveTab,
		onQuestionsChange,
		paletteOpen,
		setPaletteOpen,
		propertiesOpen,
		setPropertiesOpen,
		settingsOpen,
		setSettingsOpen,
	};

	return (
		<SurveyBuilderContext.Provider value={contextValue}>
			{children}
		</SurveyBuilderContext.Provider>
	);
}

export function useSurveyBuilder() {
	const context = useContext(SurveyBuilderContext);
	if (!context) {
		throw new Error(
			"useSurveyBuilder must be used within a SurveyBuilder component",
		);
	}
	return context;
}
