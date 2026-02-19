import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QuestionField } from "./question-field";
import type { ArrayQuestionProps, TextQuestionProps } from "./types";

interface SingleChoiceProps extends TextQuestionProps {
	options: Array<{ value: string; label: string }>;
}

interface MultipleChoiceProps extends ArrayQuestionProps {
	options: Array<{ value: string; label: string }>;
}

function SingleChoice({
	question,
	value,
	onChange,
	options,
}: SingleChoiceProps) {
	return (
		<QuestionField question={question} error={undefined}>
			<RadioGroup
				value={value ?? ""}
				onValueChange={onChange}
				className="mt-3 gap-2"
			>
				{options.map((option) => (
					<div
						key={option.value}
						className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent has-[:checked]:border-primary has-[:checked]:bg-accent"
					>
						<RadioGroupItem value={option.value} id={option.value} />
						<Label
							htmlFor={option.value}
							className="cursor-pointer text-foreground"
						>
							{option.label}
						</Label>
					</div>
				))}
			</RadioGroup>
		</QuestionField>
	);
}

function MultipleChoice({
	question,
	value,
	onChange,
	options,
}: MultipleChoiceProps) {
	const selectedValues = value ?? [];

	const handleToggle = (optionValue: string) => {
		if (selectedValues.includes(optionValue)) {
			onChange(selectedValues.filter((v) => v !== optionValue));
		} else {
			onChange([...selectedValues, optionValue]);
		}
	};

	return (
		<QuestionField question={question} error={undefined}>
			<div className="mt-3 space-y-2">
				{options.map((option) => (
					<div
						key={option.value}
						className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent has-[:checked]:border-primary has-[:checked]:bg-accent"
					>
						<Checkbox
							checked={selectedValues.includes(option.value)}
							onCheckedChange={() => handleToggle(option.value)}
							id={option.value}
						/>
						<Label
							htmlFor={option.value}
							className="cursor-pointer text-foreground"
						>
							{option.label}
						</Label>
					</div>
				))}
			</div>
		</QuestionField>
	);
}

export function ChoiceQuestion(props: TextQuestionProps) {
	const options = props.question.config?.options ?? [];
	return <SingleChoice {...props} options={options} />;
}

export function CheckboxQuestion(props: ArrayQuestionProps) {
	const options = props.question.config?.options ?? [];
	return <MultipleChoice {...props} options={options} />;
}
