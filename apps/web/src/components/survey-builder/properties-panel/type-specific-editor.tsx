"use client";

import type { Question } from "@orksys-survey/db";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChoiceEditor } from "../question-editors/choice-editor";
import { DateEditor } from "../question-editors/date-editor";
import { FileUploadEditor } from "../question-editors/file-upload-editor";
import { RatingEditor } from "../question-editors/rating-editor";
import { RuleSetSelector } from "./ruleset-selector";

interface TypeSpecificEditorProps {
	question: Question;
	onConfigChange: (config: Question["config"]) => void;
	onFieldChange: <K extends keyof Question>(
		field: K,
		value: Question[K],
	) => void;
}

export function TypeSpecificEditor({
	question,
	onConfigChange,
	onFieldChange,
}: TypeSpecificEditorProps) {
	const config = question.config || {};

	switch (question.type) {
		case "choice":
		case "radio_group":
		case "checkbox_group":
		case "multiple_choice":
		case "checkbox":
			return (
				<ChoiceEditor
					config={config}
					onChange={onConfigChange}
					allowMultiple={true}
				/>
			);

		case "dropdown":
		case "select":
		case "combobox":
			return (
				<div className="space-y-4">
					<div className="flex items-center justify-between border-border border-b pb-4">
						<div className="flex flex-col">
							<span className="font-medium text-foreground text-sm">
								Searchable
							</span>
							<span className="text-[10px] text-muted-foreground">
								Allow searching through options
							</span>
						</div>
						<Switch
							checked={config.searchable || false}
							onCheckedChange={(checked) =>
								onConfigChange({ ...config, searchable: checked })
							}
						/>
					</div>
					<ChoiceEditor
						config={config}
						onChange={onConfigChange}
						allowMultiple={false}
					/>
				</div>
			);

		case "rating":
		case "nps":
		case "slider":
		case "linear_scale":
			return (
				<RatingEditor
					config={config}
					onChange={onConfigChange}
					type={question.type as any}
				/>
			);

		case "text":
		case "input":
		case "email":
		case "phone":
		case "long_text":
		case "textarea":
			return (
				<motion.div
					className="space-y-4"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					{["text", "input", "email", "phone"].includes(question.type) && (
						<RuleSetSelector
							type="input"
							value={question.ruleSetId}
							onValueChange={(val) => onFieldChange("ruleSetId", val)}
						/>
					)}
					<div className="space-y-2">
						<Label className="text-xs uppercase tracking-wide">
							Placeholder
						</Label>
						<Input
							value={config.placeholder || ""}
							onChange={(e) =>
								onConfigChange({ ...config, placeholder: e.target.value })
							}
							placeholder="Enter placeholder text"
						/>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-2">
							<Label className="text-xs uppercase tracking-wide">Min</Label>
							<Input
								type="number"
								value={config.minLength || ""}
								onChange={(e) =>
									onConfigChange({
										...config,
										minLength: e.target.value
											? Number(e.target.value)
											: undefined,
									})
								}
								placeholder="0"
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-xs uppercase tracking-wide">Max</Label>
							<Input
								type="number"
								value={config.maxLength || ""}
								onChange={(e) =>
									onConfigChange({
										...config,
										maxLength: e.target.value
											? Number(e.target.value)
											: undefined,
									})
								}
								placeholder="500"
							/>
						</div>
					</div>
				</motion.div>
			);

		case "file_upload":
			return <FileUploadEditor config={config} onChange={onConfigChange} />;

		case "date":
		case "date_picker":
			return <DateEditor config={config} onChange={onConfigChange} />;

		default:
			return null;
	}
}
