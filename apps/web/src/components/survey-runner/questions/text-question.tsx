import { QuestionField } from "./question-field";
import type { TextQuestionProps } from "./types";

export function TextQuestion({
	question,
	value,
	onChange,
	error,
}: TextQuestionProps) {
	return (
		<QuestionField question={question} error={error}>
			<input
				type="text"
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value)}
				placeholder={question.config?.placeholder}
				className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
			/>
		</QuestionField>
	);
}
