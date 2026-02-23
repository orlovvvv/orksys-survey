import type { Question } from "@orksys-survey/db";
import {
	Calendar,
	CheckSquare,
	ChevronsUpDown,
	FileText,
	SlidersHorizontal,
	Star,
	TrendingUp,
	Type,
	Upload,
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
		icon: Type,
		description: "Single line input for names, emails, etc.",
	},
	{
		type: "long_text",
		label: "Long Text",
		icon: FileText,
		description: "Multi-line textarea for detailed feedback",
	},
	{
		type: "choice",
		label: "Choice",
		icon: CheckSquare,
		description: "Single or multiple selection options",
	},
	{
		type: "dropdown",
		label: "Dropdown",
		icon: ChevronsUpDown,
		description: "Select from a list (supports search)",
	},
	{
		type: "rating",
		label: "Rating",
		icon: Star,
		description: "Star or number satisfaction rating",
	},
	{
		type: "nps",
		label: "NPS",
		icon: TrendingUp,
		description: "Net Promoter Score (0-10)",
	},
	{
		type: "date",
		label: "Date",
		icon: Calendar,
		description: "Select a date from a calendar",
	},
	{
		type: "slider",
		label: "Slider",
		icon: SlidersHorizontal,
		description: "Range slider for numeric values",
	},
	{
		type: "file_upload",
		label: "File Upload",
		icon: Upload,
		description: "Upload files or attachments",
	},
];
