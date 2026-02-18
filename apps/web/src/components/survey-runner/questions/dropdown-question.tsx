import { QuestionField } from "./question-field";
import type { TextQuestionProps } from "./types";

export function DropdownQuestion({
	question,
	value,
	onChange,
}: TextQuestionProps) {
	const options = question.config?.options ?? [];

	return (
		<QuestionField question={question} error={undefined}>
			<select
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value)}
				className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
			>
				<option value="">Select an option</option>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</QuestionField>
	);
}
