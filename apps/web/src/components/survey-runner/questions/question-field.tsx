"use client";

import { cn } from "@/lib/utils";
import { useQuestion } from "./question-context";

interface QuestionFieldProps {
	children: React.ReactNode;
	className?: string;
}

export function QuestionField({ children, className }: QuestionFieldProps) {
	const { question, error } = useQuestion();

	return (
		<div className={cn("space-y-2", className)}>
			{/* biome-ignore lint/a11y/noLabelWithoutControl: Label is visually associated with children inputs */}
			<label className="block font-medium text-foreground">
				{question.title}
				{question.required && <span className="ml-1 text-destructive">*</span>}
			</label>
			{question.description && (
				<p className="text-muted-foreground text-sm">{question.description}</p>
			)}
			{children}
			{error && <p className="text-destructive text-sm">{error}</p>}
		</div>
	);
}
