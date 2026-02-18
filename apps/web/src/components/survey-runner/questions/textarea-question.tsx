import { QuestionField } from "./question-field";
import type { TextQuestionProps } from "./types";

export function TextareaQuestion({
	question,
	value,
	onChange,
	error,
}: TextQuestionProps) {
	return (
		<QuestionField question={question} error={error}>
			<textarea
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value)}
				placeholder={question.config?.placeholder}
				rows={4}
				className="w-full resize-none rounded-lg border border-input bg-card px-4 py-2.5 text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
			/>
		</QuestionField>
	);
}
