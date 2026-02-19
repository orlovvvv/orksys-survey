import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { QuestionField } from "./question-field";
import type { TextQuestionProps } from "./types";

export function DropdownQuestion({
	question,
	value,
	onChange,
}: TextQuestionProps) {
	const options = question.config?.options ?? [];

	const handleValueChange = (newValue: string | null) => {
		onChange(newValue ?? "");
	};

	return (
		<QuestionField question={question} error={undefined}>
			<Select value={value ?? ""} onValueChange={handleValueChange}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Select an option" />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</QuestionField>
	);
}
