import type { Question } from "@orksys-survey/db";
import { cn } from "@/lib/utils";

interface QuestionFieldProps {
	question: Question;
	error?: string | null;
	children: React.ReactNode;
	className?: string;
}

export function QuestionField({
	question,
	error,
	children,
	className,
}: QuestionFieldProps) {
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
