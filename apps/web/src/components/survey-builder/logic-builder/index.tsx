"use client";

import type { LogicRule, Question } from "@orksys-survey/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bolt, Loader2, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { orpc } from "@/utils/orpc";

import { LogicRuleForm } from "./logic-rule-form";

interface LogicBuilderProps {
	surveyId: string;
	questions: Question[];
	selectedQuestionId: string | null;
}

const actionLabels: Record<string, string> = {
	jump_to: "Jump to",
	skip: "Skip question",
	show: "Show",
	hide: "Hide",
	end_survey: "End survey",
};

const operatorLabels: Record<string, string> = {
	equals: "equals",
	not_equals: "does not equal",
	contains: "contains",
	greater_than: "is greater than",
	less_than: "is less than",
	is_empty: "is empty",
	is_not_empty: "is not empty",
};

export function LogicBuilder({
	surveyId,
	questions,
	selectedQuestionId,
}: LogicBuilderProps) {
	const queryClient = useQueryClient();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingRule, setEditingRule] = useState<LogicRule | null>(null);

	const logicRules = useQuery(
		orpc.logicRule.list.queryOptions({ input: { surveyId } }),
	);

	const deleteMutation = useMutation(
		orpc.logicRule.delete.mutationOptions({
			onSuccess: () => {
				toast.success("Logic rule deleted");
				queryClient.invalidateQueries({ queryKey: ["logicRule"] });
			},
			onError: (error) => {
				toast.error(error.message || "Failed to delete logic rule");
			},
		}),
	);

	// Filter rules for the selected question
	const questionRules = selectedQuestionId
		? logicRules.data?.filter(
				(rule) => rule.sourceQuestionId === selectedQuestionId,
			)
		: [];

	const handleDelete = (ruleId: string) => {
		if (confirm("Are you sure you want to delete this logic rule?")) {
			deleteMutation.mutate({ id: ruleId });
		}
	};

	const handleFormSuccess = () => {
		setIsDialogOpen(false);
		setEditingRule(null);
		queryClient.invalidateQueries({ queryKey: ["logicRule"] });
	};

	if (!selectedQuestionId) {
		return (
			<div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
				<div className="mb-3 flex items-center gap-2">
					<Bolt className="h-4 w-4 text-violet-500" />
					<span className="font-semibold text-neutral-900 text-sm">
						Skip Logic
					</span>
				</div>
				<p className="text-neutral-600 text-xs leading-relaxed">
					Select a question to add skip logic.
				</p>
			</div>
		);
	}

	const selectedQuestion = questions.find((q) => q.id === selectedQuestionId);
	const targetQuestions = questions.filter(
		(q) => q.order > (selectedQuestion?.order ?? 0),
	);

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Bolt className="h-4 w-4 text-violet-500" />
					<span className="font-semibold text-neutral-900 text-sm">
						Skip Logic
					</span>
					{questionRules && questionRules.length > 0 && (
						<span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 font-medium text-violet-600 text-xs">
							{questionRules.length}
						</span>
					)}
				</div>
			</div>

			{logicRules.isLoading ? (
				<div className="flex justify-center py-4">
					<Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
				</div>
			) : questionRules && questionRules.length > 0 ? (
				<div className="space-y-2">
					{questionRules.map((rule) => {
						const targetQuestion = questions.find(
							(q) => q.id === rule.targetQuestionId,
						);
						return (
							<div
								key={rule.id}
								className="group flex items-start justify-between rounded-lg border border-neutral-200 bg-white p-3"
							>
								<div className="min-w-0 flex-1">
									<p className="text-neutral-700 text-xs">
										If{" "}
										<span className="font-medium">
											{operatorLabels[rule.operator] || rule.operator}
										</span>{" "}
										{rule.conditionValue !== null &&
											rule.conditionValue !== undefined && (
												<span className="font-medium">
													"{String(rule.conditionValue)}"
												</span>
											)}
									</p>
									<p className="text-neutral-500 text-xs">
										→ {actionLabels[rule.action] || rule.action}
										{targetQuestion && (
											<span className="ml-1 font-medium">
												"{targetQuestion.title}"
											</span>
										)}
									</p>
								</div>
								<div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
									<Button
										variant="ghost"
										size="icon"
										className="h-6 w-6"
										onClick={() => {
											setEditingRule(rule);
											setIsDialogOpen(true);
										}}
									>
										<X className="h-3 w-3" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="h-6 w-6 text-red-500"
										onClick={() => handleDelete(rule.id)}
										disabled={deleteMutation.isPending}
									>
										<Trash2 className="h-3 w-3" />
									</Button>
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<p className="text-neutral-500 text-xs">
					No logic rules for this question.
				</p>
			)}

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className="w-full border-violet-200 text-violet-600 hover:bg-violet-50"
					>
						<Plus className="mr-2 h-4 w-4" />
						Add Rule
					</Button>
				</DialogTrigger>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>
							{editingRule ? "Edit Logic Rule" : "Add Logic Rule"}
						</DialogTitle>
					</DialogHeader>
					<LogicRuleForm
						surveyId={surveyId}
						questions={questions}
						sourceQuestionId={selectedQuestionId}
						targetQuestions={targetQuestions}
						existingRule={editingRule}
						onSuccess={handleFormSuccess}
						onCancel={() => {
							setIsDialogOpen(false);
							setEditingRule(null);
						}}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
