import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { orpc } from "@/utils/orpc";
import { needsConditionValue, needsTargetQuestion } from "./constants";
import { type LogicRuleFormData, logicRuleSchema } from "./logic-rule-schema";
import type {
	LogicRuleAction,
	LogicRuleFormProps,
	LogicRuleOperator,
} from "./types";

export interface LogicRuleValidationResult {
	valid: boolean;
	hasCircularDependency: boolean;
	selfReferentialRules: string[];
	conflictingRules: string[];
}

export interface UseLogicRuleFormResult {
	form: any;
	isSubmitting: boolean;
	validateQuery: any;
}

export function useLogicRuleForm({
	surveyId,
	sourceQuestionId,
	existingRule,
	onSuccess,
}: Pick<
	LogicRuleFormProps,
	"surveyId" | "sourceQuestionId" | "existingRule" | "onSuccess"
>): UseLogicRuleFormResult {
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

	const validateQuery = useQuery(
		orpc.logicRule.validate.queryOptions({
			input: { surveyId },
			queryKey: ["logicRule", "validate", surveyId],
		}),
	);

	const form = useForm({
		defaultValues: {
			operator: ((existingRule?.operator as string) ||
				"equals") as LogicRuleFormData["operator"],
			conditionValue:
				existingRule?.conditionValue !== null &&
				existingRule?.conditionValue !== undefined
					? String(existingRule.conditionValue)
					: "",
			action: ((existingRule?.action as string) ||
				"jump_to") as LogicRuleFormData["action"],
			targetQuestionId: existingRule?.targetQuestionId || "",
		},
		onSubmit: async ({ value }) => {
			const data = {
				operator: value.operator as LogicRuleOperator,
				action: value.action as LogicRuleAction,
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

	return {
		form,
		isSubmitting: createMutation.isPending || updateMutation.isPending,
		validateQuery,
	};
}
