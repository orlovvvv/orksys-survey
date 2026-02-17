"use client";

import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Question } from "@orksys-survey/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
	Bolt,
	Calendar,
	CheckSquare,
	ChevronsUpDown,
	ClipboardList,
	FileText,
	GripVertical,
	Hash,
	ListChecks,
	Mail,
	Phone,
	Star,
	Text,
	Trash2,
	TrendingUp,
	X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { orpc } from "@/utils/orpc";

interface QuestionCardProps {
	question: Question;
	isSelected: boolean;
	onSelect: () => void;
	questions: Question[];
	onQuestionsChange: (questions: Question[]) => void;
}

const questionTypeIcons: Record<string, React.ElementType> = {
	text: Text,
	textarea: FileText,
	multiple_choice: CheckSquare,
	checkbox: ListChecks,
	dropdown: ChevronsUpDown,
	rating: Star,
	nps: TrendingUp,
	linear_scale: Hash,
	date: Calendar,
	email: Mail,
	phone: Phone,
	file_upload: ClipboardList,
};

export const questionTypeLabels: Record<string, string> = {
	text: "Short Text",
	textarea: "Long Text",
	multiple_choice: "Multiple Choice",
	checkbox: "Checkboxes",
	dropdown: "Dropdown",
	rating: "Rating",
	nps: "NPS",
	linear_scale: "Linear Scale",
	date: "Date",
	email: "Email",
	phone: "Phone",
	file_upload: "File Upload",
};

export function QuestionCard({
	question,
	isSelected,
	onSelect,
	questions,
	onQuestionsChange,
}: QuestionCardProps) {
	const queryClient = useQueryClient();
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	// Sortable for reordering within canvas
	const {
		attributes,
		listeners,
		setNodeRef: setSortableRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: question.id });

	// Droppable for palette item drops
	const { setNodeRef: setDroppableRef, isOver } = useDroppable({
		id: question.id,
	});

	// Combine refs so element is both sortable and droppable
	const setNodeRef = (node: HTMLElement | null) => {
		setSortableRef(node);
		setDroppableRef(node);
	};

	const deleteMutation = useMutation(
		orpc.question.delete.mutationOptions({
			onSuccess: () => {
				onQuestionsChange(questions.filter((q) => q.id !== question.id));
				queryClient.invalidateQueries({ queryKey: ["question"] });
				toast.success("Question deleted");
			},
			onError: (error) => {
				toast.error(error.message || "Failed to delete question");
			},
		}),
	);

	// Query logic rules to check if this question has any
	const logicRules = useQuery(
		orpc.logicRule.list.queryOptions({
			input: { surveyId: question.surveyId },
		}),
	);

	const hasLogic = logicRules.data?.some(
		(rule) => rule.sourceQuestionId === question.id,
	);

	const style = {
		transform: CSS.Translate.toString(transform), // Use Translate for smoother sorting
		transition,
		zIndex: isDragging ? 50 : undefined,
	};

	const Icon = questionTypeIcons[question.type] || Text;

	return (
		<motion.div
			ref={setNodeRef}
			style={style}
			className={cn(isDragging && "z-50")}
		>
			<Card
				className={cn(
					"group cursor-pointer transition-all",
					!isSelected && "hover:border-violet-300 hover:bg-violet-50/30",
					isSelected && "border-violet-500 ring-1 ring-violet-500",
					isDragging && "opacity-50 shadow-lg",
					isOver && "border-violet-400 border-dashed bg-violet-50",
				)}
				onClick={onSelect}
			>
				<CardContent className="flex items-start gap-2 p-3">
					<button
						type="button"
						className="mt-1 cursor-grab touch-none"
						{...attributes}
						{...listeners}
					>
						<GripVertical className="h-4 w-4 text-neutral-400" />
					</button>

					<motion.div
						className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-violet-100"
						whileHover={{ scale: 1.05 }}
						transition={{ type: "spring", stiffness: 400, damping: 17 }}
					>
						<Icon className="h-4 w-4 text-violet-600" />
					</motion.div>

					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-2">
							<h3 className="truncate font-medium text-sm">{question.title}</h3>
							{question.required && (
								<motion.span
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									className="text-red-500"
								>
									*
								</motion.span>
							)}
							{hasLogic && (
								<motion.span
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									className="flex items-center gap-1 rounded bg-violet-100 px-1.5 py-0.5 font-medium text-[10px] text-violet-600"
								>
									<Bolt className="h-3 w-3" />
									Logic
								</motion.span>
							)}
						</div>
						<p className="mt-0.5 text-neutral-500 text-xs">
							{questionTypeLabels[question.type]}
							{question.description &&
								` • ${question.description.slice(0, 50)}${question.description.length > 50 ? "..." : ""}`}
						</p>
					</div>

					{showDeleteConfirm ? (
						<div className="flex shrink-0 items-center gap-1">
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7"
								onClick={(e) => {
									e.stopPropagation();
									setShowDeleteConfirm(false);
								}}
							>
								<X className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7 text-red-600 hover:bg-red-50 hover:text-red-700"
								onClick={(e) => {
									e.stopPropagation();
									deleteMutation.mutate({ id: question.id });
								}}
								disabled={deleteMutation.isPending}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					) : (
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 data-[selected=true]:opacity-100"
							data-selected={isSelected}
							onClick={(e) => {
								e.stopPropagation();
								setShowDeleteConfirm(true);
							}}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					)}
				</CardContent>
			</Card>
		</motion.div>
	);
}
