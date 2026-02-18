import { QuestionField } from "./question-field";
import type { TextQuestionProps } from "./types";

export function EmailQuestion({
	question,
	value,
	onChange,
}: TextQuestionProps) {
	return (
		<QuestionField question={question} error={undefined}>
			<input
				type="email"
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value)}
				placeholder={question.config?.placeholder ?? "email@example.com"}
				className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
			/>
		</QuestionField>
	);
}

export function PhoneQuestion({
	question,
	value,
	onChange,
}: TextQuestionProps) {
	return (
		<QuestionField question={question} error={undefined}>
			<input
				type="tel"
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value)}
				placeholder={question.config?.placeholder ?? "+1 (555) 000-0000"}
				className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
			/>
		</QuestionField>
	);
}
