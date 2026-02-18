import { QuestionField } from "./question-field";
import type { TextQuestionProps } from "./types";

export function DateQuestion({ question, value, onChange }: TextQuestionProps) {
	return (
		<QuestionField question={question} error={undefined}>
			<input
				type="date"
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value)}
				className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
			/>
		</QuestionField>
	);
}
