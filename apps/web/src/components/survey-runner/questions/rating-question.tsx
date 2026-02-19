import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
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
			<div className="mt-3 flex flex-wrap gap-1 sm:gap-2">
				{Array.from({ length: max }, (_, i) => i + 1).map((rating) => (
					<Button
						key={rating}
						type="button"
						variant={value === rating ? "default" : "outline"}
						size="icon"
						onClick={() => onChange(rating)}
						className={cn(
							"h-8 w-8 sm:h-10 sm:w-10",
							value === rating && "border-primary",
						)}
					>
						{rating}
					</Button>
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
			<div className="mt-3 flex flex-wrap gap-1 sm:gap-2">
				{Array.from({ length: 11 }, (_, i) => i).map((rating) => (
					<Button
						key={rating}
						type="button"
						variant={value === rating ? "default" : "outline"}
						size="icon"
						onClick={() => onChange(rating)}
						className={cn(
							"h-8 w-8 sm:h-10 sm:w-10",
							value === rating && "border-primary",
						)}
					>
						{rating}
					</Button>
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
				<Slider
					min={min}
					max={max}
					value={[value ?? min]}
					onValueChange={(values) => {
						const v = Array.isArray(values) ? values[0] : values;
						if (typeof v === "number") onChange(v);
					}}
					className="flex-1"
				/>
				<span className="text-muted-foreground text-sm">{max}</span>
			</div>
			<p className="text-center font-medium text-foreground">
				Selected: {value ?? min}
			</p>
		</QuestionField>
	);
}
