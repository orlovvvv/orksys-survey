"use client";

import { Slider } from "@/components/ui/slider";
import { useQuestion } from "./question-context";
import { QuestionField } from "./question-field";

export function SliderQuestion() {
	const { question, value, onChange } = useQuestion();
	const config = question.config || {};
	const min = config.min ?? 0;
	const max = config.max ?? 100;
	const step = config.step ?? 1;

	return (
		<QuestionField>
			<div className="flex flex-col gap-4 py-4">
				<Slider
					value={[value ?? min]}
					onValueChange={(vals) => {
						if (Array.isArray(vals)) {
							onChange(vals[0]);
						} else {
							onChange(vals);
						}
					}}
					min={min}
					max={max}
					step={step}
				/>
				<div className="flex justify-between text-muted-foreground text-xs uppercase tracking-wider">
					<span>{min}</span>
					<span className="font-bold text-primary">{value ?? min}</span>
					<span>{max}</span>
				</div>
			</div>
		</QuestionField>
	);
}
