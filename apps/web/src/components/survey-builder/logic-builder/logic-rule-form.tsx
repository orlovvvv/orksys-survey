"use client";

import type { LogicRule, Question } from "@orksys-survey/db";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { orpc } from "@/utils/orpc";

interface LogicRuleFormProps {
	surveyId: string;
	questions: Question[];
	sourceQuestionId: string;
	targetQuestions: Question[];
	existingRule: LogicRule | null;
	onSuccess: () => void;
	onCancel: () => void;
}

const logicRuleSchema = z.object({
	operator: z.enum([
		"equals",
		"not_equals",
		"contains",
		"greater_than",
		"less_than",
		"is_empty",
		"is_not_empty",
	]),
	conditionValue: z.string(),
	action: z.enum(["jump_to", "skip", "show", "hide", "end_survey"]),
	targetQuestionId: z.string(),
});

const operatorLabels: [string, string][] = [
	["equals", "Equals"],
	["not_equals", "Does not equal"],
	["contains", "Contains"],
	["greater_than", "Is greater than"],
	["less_than", "Is less than"],
	["is_empty", "Is empty"],
	["is_not_empty", "Is not empty"],
];

const actionLabels: [string, string][] = [
	["jump_to", "Jump to question"],
	["skip", "Skip to next"],
	["show", "Show question"],
	["hide", "Hide question"],
	["end_survey", "End survey"],
];

export function LogicRuleForm({
	surveyId,
	questions,
	sourceQuestionId,
	targetQuestions,
	existingRule,
	onSuccess,
	onCancel,
}: LogicRuleFormProps) {
	const createMutation = useMutation(
		orpc.logicRule.create.mutationOptions({
			onSuccess: () => {
				toast.success("Logic rule created");
				onSuccess();
			},
			onError: (error) => {
				toast.error(error.message || "Failed to create logic rule");
			},
		}),
	);

	const updateMutation = useMutation(
		orpc.logicRule.update.mutationOptions({
			onSuccess: () => {
				toast.success("Logic rule updated");
				onSuccess();
			},
			onError: (error) => {
				toast.error(error.message || "Failed to update logic rule");
			},
		}),
	);

	const validateMutation = useQuery(
		orpc.logicRule.validate.queryOptions({
			input: { surveyId },
			queryKey: ["logicRule", "validate", surveyId],
		}),
	);

	const sourceQuestion = questions.find((q) => q.id === sourceQuestionId);

	// Determine if we need a condition value input
	const needsConditionValue = (operator: string) => {
		return !["is_empty", "is_not_empty"].includes(operator);
	};

	// Determine if we need a target question select
	const needsTargetQuestion = (action: string) => {
		return ["jump_to", "show", "hide"].includes(action);
	};

	const form = useForm({
		defaultValues: {
			operator: (existingRule?.operator as string) || "equals",
			conditionValue:
				existingRule?.conditionValue !== null &&
				existingRule?.conditionValue !== undefined
					? String(existingRule.conditionValue)
					: "",
			action: (existingRule?.action as string) || "jump_to",
			targetQuestionId: existingRule?.targetQuestionId || "",
		},
		onSubmit: async ({ value }) => {
			const data = {
				operator: value.operator as
					| "equals"
					| "not_equals"
					| "contains"
					| "greater_than"
					| "less_than"
					| "is_empty"
					| "is_not_empty",
				action: value.action as
					| "jump_to"
					| "skip"
					| "show"
					| "hide"
					| "end_survey",
				conditionValue: needsConditionValue(value.operator)
					? value.conditionValue
					: undefined,
				targetQuestionId: needsTargetQuestion(value.action)
					? value.targetQuestionId
					: undefined,
			};

			if (existingRule) {
				await updateMutation.mutateAsync({
					id: existingRule.id,
					data,
				});
			} else {
				await createMutation.mutateAsync({
					surveyId,
					sourceQuestionId,
					...data,
				});
			}
		},
		validators: {
			onSubmit: logicRuleSchema,
		},
	});

	const isSubmitting = createMutation.isPending || updateMutation.isPending;

	// Get options for the source question (for choice-based questions)
	const getSourceOptions = () => {
		const config = sourceQuestion?.config;
		if (config?.options) {
			return config.options;
		}
		return null;
	};

	const sourceOptions = getSourceOptions();

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
			<form.Field name="operator">
				{(field) => (
					<div className="space-y-2">
						<Label className="text-neutral-500 text-xs uppercase tracking-wide">
							Condition
						</Label>
						<Select
							value={field.state.value}
							onValueChange={(value) => field.handleChange(value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select condition" />
							</SelectTrigger>
							<SelectContent>
								{operatorLabels.map(([value, label]) => (
									<SelectItem key={value} value={value}>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}
			</form.Field>

			{/* Condition Value */}
			<form.Field name="operator">
				{(operatorField) =>
					needsConditionValue(operatorField.state.value) && (
						<form.Field name="conditionValue">
							{(field) => (
								<div className="space-y-2">
									<Label className="text-neutral-500 text-xs uppercase tracking-wide">
										Value
									</Label>
									{sourceOptions ? (
										<Select
											value={field.state.value}
											onValueChange={(value) => field.handleChange(value)}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select value" />
											</SelectTrigger>
											<SelectContent>
												{sourceOptions.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									) : (
										<Input
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Enter value"
										/>
									)}
								</div>
							)}
						</form.Field>
					)
				}
			</form.Field>

			{/* Action Select */}
			<form.Field name="action">
				{(field) => (
					<div className="space-y-2">
						<Label className="text-neutral-500 text-xs uppercase tracking-wide">
							Action
						</Label>
						<Select
							value={field.state.value}
							onValueChange={(value) => field.handleChange(value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select action" />
							</SelectTrigger>
							<SelectContent>
								{actionLabels.map(([value, label]) => (
									<SelectItem key={value} value={value}>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}
			</form.Field>

			{/* Target Question Select */}
			<form.Field name="action">
				{(actionField) =>
					needsTargetQuestion(actionField.state.value) && (
						<form.Field name="targetQuestionId">
							{(field) => (
								<div className="space-y-2">
									<Label className="text-neutral-500 text-xs uppercase tracking-wide">
										Target Question
									</Label>
									<Select
										value={field.state.value}
										onValueChange={(value) => field.handleChange(value)}
									>
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
											No questions available after this one. Add more questions
											or use a different action.
										</p>
									)}
								</div>
							)}
						</form.Field>
					)
				}
			</form.Field>

			{/* Validation Errors */}
			{validateMutation.data && !validateMutation.data.valid && (
				<div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
					<p className="font-medium text-amber-800 text-sm">
						Validation Warning
					</p>
					{validateMutation.data.hasCircularDependency && (
						<p className="mt-1 text-amber-700 text-xs">
							Circular dependency detected in logic rules.
						</p>
					)}
					{validateMutation.data.selfReferentialRules.length > 0 && (
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
					{(state) => (
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
