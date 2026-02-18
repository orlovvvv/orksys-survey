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
			<div className="mt-3 space-y-2">
				{options.map((option) => (
					<label
						key={option.value}
						className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent has-[:checked]:border-primary has-[:checked]:bg-accent"
					>
						<input
							type="radio"
							name={question.id}
							value={option.value}
							checked={value === option.value}
							onChange={(e) => onChange(e.target.value)}
							className="h-4 w-4 text-primary"
						/>
						<span className="text-foreground">{option.label}</span>
					</label>
				))}
			</div>
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
					<label
						key={option.value}
						className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent has-[:checked]:border-primary has-[:checked]:bg-accent"
					>
						<input
							type="checkbox"
							checked={selectedValues.includes(option.value)}
							onChange={() => handleToggle(option.value)}
							className="h-4 w-4 rounded text-primary"
						/>
						<span className="text-foreground">{option.label}</span>
					</label>
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
