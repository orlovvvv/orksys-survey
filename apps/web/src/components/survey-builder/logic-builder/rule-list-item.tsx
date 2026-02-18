import type { LogicRule, Question } from "@orksys-survey/db";
import { Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

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

interface RuleListItemProps {
	rule: LogicRule;
	allQuestions: Question[];
	onEdit: (rule: LogicRule) => void;
	onDelete: (ruleId: string) => void;
	isDeleting: boolean;
}

export function RuleListItem({
	rule,
	allQuestions,
	onEdit,
	onDelete,
	isDeleting,
}: RuleListItemProps) {
	const targetQuestion = allQuestions.find(
		(q) => q.id === rule.targetQuestionId,
	);

	return (
		<div className="group flex items-start justify-between rounded-lg border border-border bg-card p-3">
			<div className="min-w-0 flex-1">
				<p className="text-foreground text-xs">
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
				<p className="text-muted-foreground text-xs">
					→ {actionLabels[rule.action] || rule.action}
					{targetQuestion && (
						<span className="ml-1 font-medium">"{targetQuestion.title}"</span>
					)}
				</p>
			</div>
			<div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
				<Button
					variant="ghost"
					size="icon"
					className="h-6 w-6"
					onClick={() => onEdit(rule)}
				>
					<X className="h-3 w-3" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="h-6 w-6 text-destructive"
					onClick={() => onDelete(rule.id)}
					disabled={isDeleting}
				>
					<Trash2 className="h-3 w-3" />
				</Button>
			</div>
		</div>
	);
}
