"use client";

import type { QuestionConfig } from "@orksys-survey/db";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { OptionItem } from "./option-item";

interface ChoiceEditorProps {
	config: QuestionConfig;
	onChange: (config: QuestionConfig) => void;
	allowMultiple?: boolean;
}

export function ChoiceEditor({
	config,
	onChange,
	allowMultiple = false,
}: ChoiceEditorProps) {
	const options = config.options || [
		{ label: "Option 1", value: "option_1" },
		{ label: "Option 2", value: "option_2" },
	];

	const handleAddOption = () => {
		const newOption = {
			label: `Option ${options.length + 1}`,
			value: `option_${options.length + 1}`,
		};
		onChange({ ...config, options: [...options, newOption] });
	};

	const handleUpdateOption = (
		index: number,
		field: "label" | "value",
		newValue: string,
	) => {
		const updatedOptions = options.map((opt, i) =>
			i === index ? { ...opt, [field]: newValue } : opt,
		);
		onChange({ ...config, options: updatedOptions });
	};

	const handleDeleteOption = (index: number) => {
		const updatedOptions = options.filter((_, i) => i !== index);
		onChange({ ...config, options: updatedOptions });
	};

	const handleToggleAllowOther = (checked: boolean) => {
		onChange({ ...config, allowOther: checked });
	};

	const handleToggleAllowMultiple = (checked: boolean) => {
		onChange({ ...config, allowMultiple: checked });
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label className="text-xs uppercase tracking-wide">Options</Label>
				<div className="space-y-2">
					{options.map((option, index) => (
						<OptionItem
							key={option.value}
							label={option.label}
							onChangeLabel={(label) =>
								handleUpdateOption(index, "label", label)
							}
							onDelete={() => handleDeleteOption(index)}
							canDelete={options.length > 1}
						/>
					))}
				</div>
				<Button
					variant="outline"
					size="sm"
					className="w-full"
					onClick={handleAddOption}
				>
					<Plus className="mr-2 h-4 w-4" />
					Add Option
				</Button>
			</div>

			<div className="space-y-3 border-border border-t pt-4">
				<div className="flex items-center justify-between">
					<div className="flex flex-col">
						<span className="font-medium text-foreground text-sm">
							Allow "Other"
						</span>
						<span className="text-muted-foreground text-xs">
							Let respondents add their own answer
						</span>
					</div>
					<Switch
						checked={config.allowOther || false}
						onCheckedChange={handleToggleAllowOther}
					/>
				</div>

				{allowMultiple && (
					<div className="flex items-center justify-between">
						<div className="flex flex-col">
							<span className="font-medium text-foreground text-sm">
								Allow Multiple
							</span>
							<span className="text-muted-foreground text-xs">
								Let respondents select multiple options
							</span>
						</div>
						<Switch
							checked={config.allowMultiple || false}
							onCheckedChange={handleToggleAllowMultiple}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
