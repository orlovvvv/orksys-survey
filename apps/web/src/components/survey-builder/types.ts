import type { Question, Survey } from "@orksys-survey/db";

// Extended survey type that includes organization data from API
export interface SurveyWithOrganization extends Survey {
	organization?: {
		id: string;
		name: string;
		slug: string;
		logo: string | null;
	} | null;
}

// Builder context for sharing state across components
export interface SurveyBuilderContextValue {
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
}

// Drag item types
export interface PaletteDragItem {
	type: "palette";
	questionType: Question["type"];
}

export interface QuestionDragItem {
	type: "question";
	id: string;
}

export type DragItem = PaletteDragItem | QuestionDragItem;
