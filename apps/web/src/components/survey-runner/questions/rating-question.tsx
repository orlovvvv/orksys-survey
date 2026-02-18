import { QuestionField } from "./question-field";
import type { NumberQuestionProps } from "./types";

export function RatingQuestion({
	question,
	value,
	onChange,
}: NumberQuestionProps) {
	const max = question.config?.max ?? 5;

	return (
		<QuestionField question={question} error={undefined}>
			<div className="mt-3 flex gap-2">
				{Array.from({ length: max }, (_, i) => i + 1).map((rating) => (
					<button
						key={rating}
						type="button"
						onClick={() => onChange(rating)}
						className={`h-10 w-10 rounded-lg border font-medium text-sm transition-colors ${
							value === rating
								? "border-primary bg-primary text-primary-foreground"
								: "border-input text-muted-foreground hover:bg-accent"
						}`}
					>
						{rating}
					</button>
				))}
			</div>
		</QuestionField>
	);
}

export function NpsQuestion({
	question,
	value,
	onChange,
}: NumberQuestionProps) {
	return (
		<QuestionField question={question} error={undefined} className="space-y-3">
			<div className="mt-3 flex gap-1">
				{Array.from({ length: 11 }, (_, i) => i).map((rating) => (
					<button
						key={rating}
						type="button"
						onClick={() => onChange(rating)}
						className={`h-10 w-10 rounded-lg border font-medium text-sm transition-colors ${
							value === rating
								? "border-primary bg-primary text-primary-foreground"
								: "border-input text-muted-foreground hover:bg-accent"
						}`}
					>
						{rating}
					</button>
				))}
			</div>
			<div className="flex justify-between text-muted-foreground text-xs">
				<span>0 = Not likely</span>
				<span>10 = Very likely</span>
			</div>
		</QuestionField>
	);
}

export function LinearScaleQuestion({
	question,
	value,
	onChange,
}: NumberQuestionProps) {
	const min = question.config?.min ?? 1;
	const max = question.config?.max ?? 10;

	return (
		<QuestionField question={question} error={undefined}>
			<div className="mt-3 flex items-center gap-4">
				<span className="text-muted-foreground text-sm">{min}</span>
				<input
					type="range"
					min={min}
					max={max}
					value={value ?? min}
					onChange={(e) => onChange(Number(e.target.value))}
					className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-muted"
				/>
				<span className="text-muted-foreground text-sm">{max}</span>
			</div>
			<p className="text-center font-medium text-foreground">
				Selected: {value ?? min}
			</p>
		</QuestionField>
	);
}
