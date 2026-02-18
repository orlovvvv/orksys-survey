"use client";

import type { Question } from "@orksys-survey/db";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { actionLabels, operatorLabels } from "./constants";

interface OperatorSelectProps {
	value: string;
	onValueChange: (value: string) => void;
}

export function OperatorSelect({ value, onValueChange }: OperatorSelectProps) {
	return (
		<div className="space-y-2">
			<Label className="text-muted-foreground text-xs uppercase tracking-wide">
				Condition
			</Label>
			<Select value={value} onValueChange={(v) => v && onValueChange(v)}>
				<SelectTrigger>
					<SelectValue placeholder="Select condition" />
				</SelectTrigger>
				<SelectContent>
					{operatorLabels.map(([operatorValue, label]) => (
						<SelectItem key={operatorValue} value={operatorValue}>
							{label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

interface ConditionValueFieldProps {
	value: string;
	onValueChange: (value: string) => void;
	sourceOptions: Array<{ label: string; value: string }> | null;
}

export function ConditionValueField({
	value,
	onValueChange,
	sourceOptions,
}: ConditionValueFieldProps) {
	return (
		<div className="space-y-2">
			<Label className="text-muted-foreground text-xs uppercase tracking-wide">
				Value
			</Label>
			{sourceOptions ? (
				<Select value={value} onValueChange={(v) => v && onValueChange(v)}>
					<SelectTrigger>
						<SelectValue placeholder="Select value" />
					</SelectTrigger>
					<SelectContent>
						{sourceOptions.map((option: { label: string; value: string }) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			) : (
				<Input
					value={value}
					onChange={(e) => onValueChange(e.target.value)}
					placeholder="Enter value"
				/>
			)}
		</div>
	);
}

interface ActionSelectProps {
	value: string;
	onValueChange: (value: string) => void;
}

export function ActionSelect({ value, onValueChange }: ActionSelectProps) {
	return (
		<div className="space-y-2">
			<Label className="text-muted-foreground text-xs uppercase tracking-wide">
				Action
			</Label>
			<Select value={value} onValueChange={(v) => v && onValueChange(v)}>
				<SelectTrigger>
					<SelectValue placeholder="Select action" />
				</SelectTrigger>
				<SelectContent>
					{actionLabels.map(([actionValue, label]) => (
						<SelectItem key={actionValue} value={actionValue}>
							{label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

interface TargetQuestionSelectProps {
	value: string;
	onValueChange: (value: string) => void;
	targetQuestions: Question[];
}

export function TargetQuestionSelect({
	value,
	onValueChange,
	targetQuestions,
}: TargetQuestionSelectProps) {
	return (
		<div className="space-y-2">
			<Label className="text-muted-foreground text-xs uppercase tracking-wide">
				Target Question
			</Label>
			<Select value={value} onValueChange={(v) => v && onValueChange(v)}>
				<SelectTrigger>
					<SelectValue placeholder="Select question" />
				</SelectTrigger>
				<SelectContent>
					{targetQuestions.map((question) => (
						<SelectItem key={question.id} value={question.id}>
							{question.title}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{targetQuestions.length === 0 && (
				<p className="text-amber-600 text-xs">
					No questions available after this one. Add more questions or use a
					different action.
				</p>
			)}
		</div>
	);
}
