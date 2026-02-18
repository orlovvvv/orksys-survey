"use client";

import type { Question } from "@orksys-survey/db";
import { motion } from "framer-motion";
import { Bolt, GripVertical, Text } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { questionTypeIcons, questionTypeLabels } from "./constants";

export interface QuestionCardContentProps {
	question: Question;
	isSelected?: boolean;
	hasLogic?: boolean;
	onSelect?: () => void;
	onDelete?: () => void;
	isDeleting?: boolean;
	dragHandleProps?: any;
	isDragging?: boolean;
	isOver?: boolean;
	isOverlay?: boolean;
	isPlaceholder?: boolean;
}

export function QuestionCardContent({
	question,
	isSelected,
	hasLogic,
	onSelect,
	dragHandleProps,
	isDragging,
	isOver,
	isOverlay,
	isPlaceholder: explicitIsPlaceholder,
	children,
}: QuestionCardContentProps & { children?: React.ReactNode }) {
	const Icon = questionTypeIcons[question.type] || Text;
	const isPlaceholder = explicitIsPlaceholder || (isDragging && !isOverlay);

	return (
		<Card
			className={cn(
				"group cursor-pointer gap-0 p-0 transition-all",
				!isSelected &&
					!isOverlay &&
					!isPlaceholder &&
					"hover:border-primary/50 hover:bg-primary/5",
				isSelected && !isPlaceholder && "border-primary ring-1 ring-primary",
				isPlaceholder &&
					"border-2 border-primary/60 border-dashed bg-primary/10 opacity-100 shadow-none ring-0",
				isOverlay && "cursor-grabbing bg-card shadow-xl ring-2 ring-ring",
			)}
			onClick={onSelect}
		>
			<CardContent
				className={cn(
					"flex items-start gap-3 p-4",
					isPlaceholder && "opacity-0",
				)}
			>
				<button
					type="button"
					className={cn(
						"mt-1 touch-none",
						isOverlay ? "cursor-grabbing" : "cursor-grab",
					)}
					{...dragHandleProps}
				>
					<GripVertical className="h-4 w-4 text-muted-foreground" />
				</button>

				<motion.div
					className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary/10"
					whileHover={{ scale: 1.05 }}
					transition={{ type: "spring", stiffness: 400, damping: 17 }}
				>
					<Icon className="h-4 w-4 text-primary" />
				</motion.div>

				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<h3 className="truncate font-medium text-sm">{question.title}</h3>
						{question.required && (
							<motion.span
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								className="text-destructive"
							>
								*
							</motion.span>
						)}
						{hasLogic && (
							<motion.span
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								className="flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 font-medium text-[10px] text-primary"
							>
								<Bolt className="h-3 w-3" />
								Logic
							</motion.span>
						)}
					</div>
					<p className="mt-0.5 text-muted-foreground text-xs">
						{questionTypeLabels[question.type]}
						{question.description &&
							` • ${question.description.slice(0, 50)}${question.description.length > 50 ? "..." : ""}`}
					</p>
				</div>

				{children}
			</CardContent>
		</Card>
	);
}
