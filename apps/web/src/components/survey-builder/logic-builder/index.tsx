"use client";

import type { LogicRule, Question } from "@orksys-survey/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bolt, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { orpc } from "@/utils/orpc";

import { LogicRuleForm } from "./logic-rule-form";
import { RuleListItem } from "./rule-list-item";

interface LogicBuilderProps {
	surveyId: string;
	questions: Question[];
	selectedQuestionId: string | null;
}

export function LogicBuilder({
	surveyId,
	questions,
	selectedQuestionId,
}: LogicBuilderProps) {
	const queryClient = useQueryClient();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingRule, setEditingRule] = useState<LogicRule | null>(null);
	const [deleteRuleId, setDeleteRuleId] = useState<string | null>(null);

	const logicRules = useQuery(
		orpc.logicRule.list.queryOptions({ input: { surveyId } }),
	);

	const deleteMutation = useMutation(
		orpc.logicRule.delete.mutationOptions({
			onSuccess: () => {
				toast.success("Logic rule deleted");
				queryClient.invalidateQueries({ queryKey: ["logicRule"] });
				setDeleteRuleId(null);
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
		setDeleteRuleId(ruleId);
	};

	const confirmDelete = () => {
		if (deleteRuleId) {
			deleteMutation.mutate({ id: deleteRuleId });
		}
	};

	const handleFormSuccess = () => {
		setIsDialogOpen(false);
		setEditingRule(null);
		queryClient.invalidateQueries({ queryKey: ["logicRule"] });
	};

	if (!selectedQuestionId) {
		return (
			<div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
				<div className="mb-3 flex items-center gap-2">
					<Bolt className="h-4 w-4 text-primary" />
					<span className="font-semibold text-foreground text-sm">
						Skip Logic
					</span>
				</div>
				<p className="text-muted-foreground text-xs leading-relaxed">
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
		<>
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Bolt className="h-4 w-4 text-primary" />
						<span className="font-semibold text-foreground text-sm">
							Skip Logic
						</span>
						{questionRules && questionRules.length > 0 && (
							<span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs">
								{questionRules.length}
							</span>
						)}
					</div>
				</div>

				{logicRules.isLoading ? (
					<div className="flex justify-center py-4">
						<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
					</div>
				) : questionRules && questionRules.length > 0 ? (
					<div className="space-y-2">
						{questionRules.map((rule) => (
							<RuleListItem
								key={rule.id}
								rule={rule}
								allQuestions={questions}
								onEdit={(r) => {
									setEditingRule(r);
									setIsDialogOpen(true);
								}}
								onDelete={handleDelete}
								isDeleting={deleteMutation.isPending}
							/>
						))}
					</div>
				) : (
					<p className="text-muted-foreground text-xs">
						No logic rules for this question.
					</p>
				)}

				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger
						render={
							<Button
								variant="outline"
								size="sm"
								className="w-full border-primary/30 text-primary hover:bg-primary/10"
							/>
						}
					>
						<Plus className="mr-2 h-4 w-4" />
						Add Rule
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
							existingRule={
								editingRule
									? {
											id: editingRule.id,
											operator: editingRule.operator,
											action: editingRule.action,
											conditionValue:
												editingRule.conditionValue !== null &&
												editingRule.conditionValue !== undefined
													? String(editingRule.conditionValue)
													: null,
											targetQuestionId: editingRule.targetQuestionId,
										}
									: null
							}
							onSuccess={handleFormSuccess}
							onCancel={() => {
								setIsDialogOpen(false);
								setEditingRule(null);
							}}
						/>
					</DialogContent>
				</Dialog>
			</div>

			<Dialog open={!!deleteRuleId} onOpenChange={() => setDeleteRuleId(null)}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Delete Logic Rule</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this logic rule? This action
							cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeleteRuleId(null)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={confirmDelete}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
