"use client";

import { Textarea } from "@/components/ui/textarea";
import { useQuestion } from "./question-context";
import { QuestionField } from "./question-field";

export function LongTextQuestion() {
	const { question, value, onChange } = useQuestion();
	const config = question.config || {};

	return (
		<QuestionField>
			<Textarea
				value={value || ""}
				onChange={(e) => onChange(e.target.value)}
				placeholder={config.placeholder || "Type your long answer here..."}
				required={question.required}
				rows={4}
			/>
		</QuestionField>
	);
}
