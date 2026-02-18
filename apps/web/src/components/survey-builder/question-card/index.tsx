"use client";

import { useDroppable } from "@dnd-kit/core";
import { type AnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Question } from "@orksys-survey/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { createContext, memo, useContext } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { orpc } from "@/utils/orpc";
import { DeleteConfirmButton } from "../primitives/delete-confirm-button";
import type { questionTypeIcons, questionTypeLabels } from "./constants";
import {
	QuestionCardContent,
	type QuestionCardContentProps,
} from "./question-card-content";

// Re-export types
export type { QuestionCardContentProps };
export type { questionTypeIcons, questionTypeLabels };

// Compound component types
export interface QuestionCardBadgeProps {
	children: React.ReactNode;
	className?: string;
}

export interface QuestionCardActionsProps {
	onDelete?: () => void;
	isDeleting?: boolean;
	className?: string;
}

// Context for sharing question card state with compound components
interface QuestionCardContextValue {
	question: Question;
	isOverlay?: boolean;
	isSelected?: boolean;
}

const QuestionCardContext = createContext<QuestionCardContextValue | null>(
	null,
);

function useQuestionCardContext() {
	const context = useContext(QuestionCardContext);
	if (!context) {
		throw new Error(
			"QuestionCard compound components must be used within QuestionCard",
		);
	}
	return context;
}

interface QuestionCardProps {
	question: Question;
	isSelected: boolean;
	onSelect: () => void;
	questions: Question[];
	onQuestionsChange: (questions: Question[]) => void;
	children?: React.ReactNode;
}

const animateLayoutChanges: AnimateLayoutChanges = () => {
	return false;
};

export const QuestionCard = memo(function QuestionCard({
	question,
	isSelected,
	onSelect,
	questions,
	onQuestionsChange,
	children,
}: QuestionCardProps) {
	const queryClient = useQueryClient();

	// Sortable for reordering within canvas
	const {
		attributes,
		listeners,
		setNodeRef: setSortableRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: question.id,
		animateLayoutChanges,
	});

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
		transform: CSS.Translate.toString(transform),
		transition,
		zIndex: isDragging ? 50 : undefined,
	};

	const contextValue: QuestionCardContextValue = {
		question,
		isOverlay: false,
		isSelected,
	};

	return (
		<QuestionCardContext.Provider value={contextValue}>
			<motion.div
				ref={setNodeRef}
				style={style}
				className={cn(isDragging && "z-50")}
			>
				<QuestionCardContent
					question={question}
					isSelected={isSelected}
					hasLogic={hasLogic}
					onSelect={onSelect}
					dragHandleProps={{ ...attributes, ...listeners }}
					isDragging={isDragging}
					isOver={isOver}
				>
					<QuestionCardActions
						onDelete={() => deleteMutation.mutate({ id: question.id })}
						isDeleting={deleteMutation.isPending}
					/>
				</QuestionCardContent>
			</motion.div>
		</QuestionCardContext.Provider>
	);
});

// Badge component for displaying question metadata
export const QuestionCardBadge = function QuestionCardBadge({
	children,
	className,
}: QuestionCardBadgeProps) {
	const { question } = useQuestionCardContext();
	return (
		<motion.span
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			className={cn(
				"flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 font-medium text-[10px] text-primary",
				className,
			)}
		>
			{children}
		</motion.span>
	);
};

// Actions component for question card actions (delete, etc.)
export const QuestionCardActions = function QuestionCardActions({
	onDelete,
	isDeleting = false,
	className,
}: QuestionCardActionsProps) {
	const { question, isSelected, isOverlay } = useQuestionCardContext();

	if (isOverlay || !onDelete) {
		return null;
	}

	return (
		<DeleteConfirmButton
			onDelete={onDelete}
			isDeleting={isDeleting}
			className={cn(
				"opacity-0 transition-opacity group-hover:opacity-100 data-[selected=true]:opacity-100",
				className,
			)}
			data-selected={isSelected}
		/>
	);
};

// Export the content component for external use
export { QuestionCardContent };
