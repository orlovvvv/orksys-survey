"use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { useQuestion } from "./question-context";
import { QuestionField } from "./question-field";

export function TextQuestion() {
	const { question, value, onChange, ruleSet } = useQuestion();
	const config = question.config || {};

	const rsConfig = useMemo(
		() => ({
			...(ruleSet?.config || {}),
			...(question.ruleSetConfigOverrides || {}),
		}),
		[ruleSet, question.ruleSetConfigOverrides],
	);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		if (rsConfig.inputType === "number") {
			const num = Number(newValue);
			if (!Number.isNaN(num)) {
				onChange(num);
				return;
			}
		}
		onChange(newValue);
	};

	const displayValue =
		value === undefined || value === null ? "" : String(value);

	return (
		<QuestionField>
			<div className="flex items-center gap-2">
				{rsConfig.prefix && (
					<span className="font-medium text-muted-foreground">
						{rsConfig.prefix}
					</span>
				)}
				<Input
					type={rsConfig.inputType || "text"}
					value={displayValue}
					onChange={handleChange}
					placeholder={
						config.placeholder || rsConfig.placeholder || "Type your answer..."
					}
					minLength={config.minLength}
					maxLength={config.maxLength}
					min={rsConfig.min}
					max={rsConfig.max}
					step={rsConfig.step}
					pattern={rsConfig.pattern}
					required={question.required}
					className="flex-1"
				/>
				{rsConfig.suffix && (
					<span className="font-medium text-muted-foreground">
						{rsConfig.suffix}
					</span>
				)}
			</div>
		</QuestionField>
	);
}
