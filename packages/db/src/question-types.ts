import type { InferSelectModel } from "drizzle-orm";
import type { question } from "./schema/survey";

// Infer the Question type directly to avoid circular imports
type Question = InferSelectModel<typeof question>;

export interface QuestionTypeConfig {
	type: Question["type"];
	label: string;
	// Icon name as string for cross-platform compatibility
	iconName: string;
	description: string;
}

export const QUESTION_TYPE_CONFIG: Record<
	Question["type"],
	QuestionTypeConfig
> = {
	text: {
		type: "text",
		label: "Short Text",
		iconName: "Type",
		description: "Single line input for short answers",
	},
	long_text: {
		type: "long_text",
		label: "Long Text",
		iconName: "FileText",
		description: "Multi-line textarea for detailed feedback",
	},
	choice: {
		type: "choice",
		label: "Choice",
		iconName: "CheckSquare",
		description: "Single or multiple selection options",
	},
	dropdown: {
		type: "dropdown",
		label: "Dropdown",
		iconName: "ChevronsUpDown",
		description: "Select from a list (supports search)",
	},
	rating: {
		type: "rating",
		label: "Rating",
		iconName: "Star",
		description: "Star or number satisfaction rating",
	},
	nps: {
		type: "nps",
		label: "NPS",
		iconName: "TrendingUp",
		description: "Net Promoter Score (0-10)",
	},
	date: {
		type: "date",
		label: "Date",
		iconName: "Calendar",
		description: "Select a date from a calendar",
	},
	slider: {
		type: "slider",
		label: "Slider",
		iconName: "SlidersHorizontal",
		description: "Range slider for numeric values",
	},
	file_upload: {
		type: "file_upload",
		label: "File Upload",
		iconName: "Upload",
		description: "Upload files or attachments",
	},
	// Legacy mappings
	input: {
		type: "input",
		label: "Input",
		iconName: "Type",
		description: "Legacy",
	},
	textarea: {
		type: "textarea",
		label: "Textarea",
		iconName: "FileText",
		description: "Legacy",
	},
	select: {
		type: "select",
		label: "Select",
		iconName: "ChevronsUpDown",
		description: "Legacy",
	},
	radio_group: {
		type: "radio_group",
		label: "Radio Group",
		iconName: "CircleDot",
		description: "Legacy",
	},
	checkbox_group: {
		type: "checkbox_group",
		label: "Checkbox Group",
		iconName: "ListChecks",
		description: "Legacy",
	},
	switch: {
		type: "switch",
		label: "Switch",
		iconName: "ToggleRight",
		description: "Legacy",
	},
	date_picker: {
		type: "date_picker",
		label: "Date Picker",
		iconName: "Calendar",
		description: "Legacy",
	},
	combobox: {
		type: "combobox",
		label: "Combobox",
		iconName: "Search",
		description: "Legacy",
	},
	otp: { type: "otp", label: "OTP", iconName: "Lock", description: "Legacy" },
	multiple_choice: {
		type: "multiple_choice",
		label: "Multiple Choice",
		iconName: "CheckSquare",
		description: "Legacy",
	},
	checkbox: {
		type: "checkbox",
		label: "Checkboxes",
		iconName: "ListChecks",
		description: "Legacy",
	},
	email: {
		type: "email",
		label: "Email",
		iconName: "Mail",
		description: "Legacy",
	},
	phone: {
		type: "phone",
		label: "Phone",
		iconName: "Phone",
		description: "Legacy",
	},
	linear_scale: {
		type: "linear_scale",
		label: "Linear Scale",
		iconName: "Hash",
		description: "Legacy",
	},
};

export const questionTypes = Object.values(QUESTION_TYPE_CONFIG).filter(
	(q) => !q.description.includes("Legacy"),
);

export function getQuestionLabel(type: Question["type"]) {
	return QUESTION_TYPE_CONFIG[type]?.label ?? type;
}

export function getQuestionIconName(type: Question["type"]) {
	return QUESTION_TYPE_CONFIG[type]?.iconName;
}
