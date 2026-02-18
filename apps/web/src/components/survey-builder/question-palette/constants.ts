import type { Question } from "@orksys-survey/db";
import {
	Calendar,
	CheckSquare,
	ChevronsUpDown,
	ClipboardList,
	FileText,
	Hash,
	ListChecks,
	Mail,
	Phone,
	Star,
	Text,
	TrendingUp,
} from "lucide-react";

export interface QuestionTypeConfig {
	type: Question["type"];
	label: string;
	icon: React.ElementType;
	description: string;
}

export const questionTypes: QuestionTypeConfig[] = [
	{
		type: "text",
		label: "Short Text",
		icon: Text,
		description: "Single line text input",
	},
	{
		type: "textarea",
		label: "Long Text",
		icon: FileText,
		description: "Multi-line text area",
	},
	{
		type: "multiple_choice",
		label: "Multiple Choice",
		icon: CheckSquare,
		description: "Single selection from options",
	},
	{
		type: "checkbox",
		label: "Checkboxes",
		icon: ListChecks,
		description: "Multiple selections allowed",
	},
	{
		type: "dropdown",
		label: "Dropdown",
		icon: ChevronsUpDown,
		description: "Dropdown selection list",
	},
	{
		type: "rating",
		label: "Rating",
		icon: Star,
		description: "Star or number rating",
	},
	{
		type: "nps",
		label: "NPS",
		icon: TrendingUp,
		description: "Net Promoter Score 0-10",
	},
	{
		type: "linear_scale",
		label: "Linear Scale",
		icon: Hash,
		description: "Custom range scale",
	},
	{
		type: "date",
		label: "Date",
		icon: Calendar,
		description: "Date picker",
	},
	{
		type: "email",
		label: "Email",
		icon: Mail,
		description: "Email address input",
	},
	{
		type: "phone",
		label: "Phone",
		icon: Phone,
		description: "Phone number input",
	},
	{
		type: "file_upload",
		label: "File Upload",
		icon: ClipboardList,
		description: "File upload field",
	},
];
