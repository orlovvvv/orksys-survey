"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuestion } from "./question-context";
import { QuestionField } from "./question-field";

export function ChoiceQuestion() {
	const { question, value, onChange } = useQuestion();
	const options = question.config?.options || [];
	const allowMultiple =
		question.config?.allowMultiple ||
		question.type === "checkbox_group" ||
		question.type === "checkbox";
	const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

	const handleToggle = (optionValue: string) => {
		if (allowMultiple) {
			if (selectedValues.includes(optionValue)) {
				onChange(selectedValues.filter((v) => v !== optionValue));
			} else {
				onChange([...selectedValues, optionValue]);
			}
		} else {
			onChange(optionValue);
		}
	};

	return (
		<QuestionField>
			{allowMultiple ? (
				<div className="mt-3 space-y-2">
					{options.map((option) => (
						<Label
							key={option.value}
							htmlFor={option.value}
							className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent has-data-[state=checked]:border-primary has-data-[state=checked]:bg-accent"
						>
							<Checkbox
								checked={selectedValues.includes(option.value)}
								onCheckedChange={() => handleToggle(option.value)}
								id={option.value}
							/>
							<span className="text-foreground">{option.label}</span>
						</Label>
					))}
				</div>
			) : (
				<RadioGroup
					value={value || ""}
					onValueChange={onChange}
					className="mt-3 gap-2"
				>
					{options.map((option) => (
						<Label
							key={option.value}
							htmlFor={option.value}
							className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent has-data-[state=checked]:border-primary has-data-[state=checked]:bg-accent"
						>
							<RadioGroupItem value={option.value} id={option.value} />
							<span className="text-foreground">{option.label}</span>
						</Label>
					))}
				</RadioGroup>
			)}
		</QuestionField>
	);
}
