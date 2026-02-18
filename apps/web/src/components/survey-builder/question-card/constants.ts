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

export const questionTypeIcons: Record<string, React.ElementType> = {
	text: Text,
	textarea: FileText,
	multiple_choice: CheckSquare,
	checkbox: ListChecks,
	dropdown: ChevronsUpDown,
	rating: Star,
	nps: TrendingUp,
	linear_scale: Hash,
	date: Calendar,
	email: Mail,
	phone: Phone,
	file_upload: ClipboardList,
};

export const questionTypeLabels: Record<string, string> = {
	text: "Short Text",
	textarea: "Long Text",
	multiple_choice: "Multiple Choice",
	checkbox: "Checkboxes",
	dropdown: "Dropdown",
	rating: "Rating",
	nps: "NPS",
	linear_scale: "Linear Scale",
	date: "Date",
	email: "Email",
	phone: "Phone",
	file_upload: "File Upload",
};
