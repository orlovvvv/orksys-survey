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

export const QUESTION_TYPE_CONFIG: Record<Question["type"], QuestionTypeConfig> = {
	text: {
		type: "text",
		label: "Short Text",
		iconName: "Text",
		description: "Single line text input",
	},
	textarea: {
		type: "textarea",
		label: "Long Text",
		iconName: "FileText",
		description: "Multi-line text area",
	},
	multiple_choice: {
		type: "multiple_choice",
		label: "Multiple Choice",
		iconName: "CheckSquare",
		description: "Single selection from options",
	},
	checkbox: {
		type: "checkbox",
		label: "Checkboxes",
		iconName: "ListChecks",
		description: "Multiple selections allowed",
	},
	dropdown: {
		type: "dropdown",
		label: "Dropdown",
		iconName: "ChevronsUpDown",
		description: "Dropdown selection list",
	},
	rating: {
		type: "rating",
		label: "Rating",
		iconName: "Star",
		description: "Star or number rating",
	},
	nps: {
		type: "nps",
		label: "NPS",
		iconName: "TrendingUp",
		description: "Net Promoter Score 0-10",
	},
	linear_scale: {
		type: "linear_scale",
		label: "Linear Scale",
		iconName: "Hash",
		description: "Custom range scale",
	},
	date: {
		type: "date",
		label: "Date",
		iconName: "Calendar",
		description: "Date picker",
	},
	email: {
		type: "email",
		label: "Email",
		iconName: "Mail",
		description: "Email address input",
	},
	phone: {
		type: "phone",
		label: "Phone",
		iconName: "Phone",
		description: "Phone number input",
	},
	file_upload: {
		type: "file_upload",
		label: "File Upload",
		iconName: "ClipboardList",
		description: "File upload field",
	},
};

export const questionTypes = Object.values(QUESTION_TYPE_CONFIG);

export function getQuestionLabel(type: Question["type"]) {
	return QUESTION_TYPE_CONFIG[type]?.label ?? type;
}

export function getQuestionIconName(type: Question["type"]) {
	return QUESTION_TYPE_CONFIG[type]?.iconName;
}
