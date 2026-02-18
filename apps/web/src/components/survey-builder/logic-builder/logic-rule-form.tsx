"use client";

import type { Question } from "@orksys-survey/db";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { needsConditionValue, needsTargetQuestion } from "./constants";
import {
	ActionSelect,
	ConditionValueField,
	OperatorSelect,
	TargetQuestionSelect,
} from "./form-fields";
import type { LogicRuleFormProps } from "./types";
import { useLogicRuleForm } from "./use-logic-rule-form";

export function LogicRuleForm({
	surveyId,
	questions,
	sourceQuestionId,
	targetQuestions,
	existingRule,
	onSuccess,
	onCancel,
}: LogicRuleFormProps) {
	const { form, isSubmitting, validateQuery } = useLogicRuleForm({
		surveyId,
		sourceQuestionId,
		existingRule,
		onSuccess,
	});

	const sourceQuestion = questions.find((q) => q.id === sourceQuestionId);
	const sourceOptions = sourceQuestion?.config?.options || null;

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-4"
		>
			{/* Source Question Info */}
			<div className="rounded-lg bg-neutral-50 p-3">
				<Label className="text-neutral-500 text-xs uppercase tracking-wide">
					Source Question
				</Label>
				<p className="mt-1 font-medium text-sm">{sourceQuestion?.title}</p>
			</div>

			{/* Operator Select */}
			<form.Field
				name="operator"
				children={(field: any) => (
					<OperatorSelect
						value={field.state.value}
						onValueChange={(value: string) => field.handleChange(value)}
					/>
				)}
			/>

			{/* Condition Value */}
			<form.Field
				name="operator"
				children={(operatorField: any) =>
					needsConditionValue(operatorField.state.value) && (
						<form.Field
							name="conditionValue"
							children={(field: any) => (
								<ConditionValueField
									value={field.state.value}
									onValueChange={(value: string) =>
										field.handleChange(value)
									}
									sourceOptions={sourceOptions}
								/>
							)}
						/>
					)
				}
			/>

			{/* Action Select */}
			<form.Field
				name="action"
				children={(field: any) => (
					<ActionSelect
						value={field.state.value}
						onValueChange={(value: string) => field.handleChange(value)}
					/>
				)}
			/>

			{/* Target Question Select */}
			<form.Field
				name="action"
				children={(actionField: any) =>
					needsTargetQuestion(actionField.state.value) && (
						<form.Field
							name="targetQuestionId"
							children={(field: any) => (
								<TargetQuestionSelect
									value={field.state.value}
									onValueChange={(value: string) =>
										field.handleChange(value)
									}
									targetQuestions={targetQuestions}
								/>
							)}
						/>
					)
				}
			/>

			{/* Validation Errors */}
			{validateQuery.data && !validateQuery.data.valid && (
				<div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
					<p className="font-medium text-amber-800 text-sm">
						Validation Warning
					</p>
					{validateQuery.data.hasCircularDependency && (
						<p className="mt-1 text-amber-700 text-xs">
							Circular dependency detected in logic rules.
						</p>
					)}
					{validateQuery.data.selfReferentialRules.length > 0 && (
						<p className="mt-1 text-amber-700 text-xs">
							Some rules reference themselves.
						</p>
					)}
				</div>
			)}

			{/* Actions */}
			<div className="flex gap-3 pt-4">
				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					className="flex-1"
				>
					Cancel
				</Button>
				<form.Subscribe>
					{(state: any) => (
						<Button
							type="submit"
							disabled={!state.canSubmit || isSubmitting}
							className="flex-1"
						>
							{isSubmitting ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : existingRule ? (
								"Update Rule"
							) : (
								"Create Rule"
							)}
						</Button>
					)}
				</form.Subscribe>
			</div>
		</form>
	);
}
