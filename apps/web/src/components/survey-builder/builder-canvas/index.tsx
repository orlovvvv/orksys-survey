"use client";

import { useDroppable } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Question } from "@orksys-survey/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { orpc } from "@/utils/orpc";
import { useSurveyBuilder } from "../index";
import { QuestionCard } from "../question-card";
import { DropIndicator } from "./drop-indicator";
import { PreviewCanvas } from "./preview-canvas";
import { ShareCanvas } from "./share-canvas";

// Drag item types
export interface PaletteDragItem {
	type: "palette";
	questionType: Question["type"];
}

export interface QuestionDragItem {
	type: "question";
	id: string;
}

export type DragItem = PaletteDragItem | QuestionDragItem;

interface BuilderCanvasProps {
	questions: Question[];
	onQuestionsChange: (questions: Question[]) => void;
	activeDragItem: DragItem | null;
	overId: string | null;
}

export function BuilderCanvas({
	questions,
	onQuestionsChange,
	activeDragItem,
	overId,
}: BuilderCanvasProps) {
	const { survey, selectedQuestionId, setSelectedQuestionId, activeTab } =
		useSurveyBuilder();

	const queryClient = useQueryClient();

	// Make canvas droppable
	const { setNodeRef, isOver } = useDroppable({
		id: "canvas",
	});

	const safeQuestions = questions || [];

	const createMutation = useMutation(
		orpc.question.create.mutationOptions({
			onSuccess: (newQuestion) => {
				onQuestionsChange([...questions, newQuestion]);
				setSelectedQuestionId(newQuestion.id);
				queryClient.invalidateQueries({ queryKey: ["question"] });
				toast.success("Question added");
			},
			onError: (error) => {
				toast.error(error.message || "Failed to create question");
			},
		}),
	);

	const handleAddQuestion = () => {
		createMutation.mutate({
			surveyId: survey.id,
			type: "text",
			title: "New Question",
			order: safeQuestions.length,
		});
	};

	// Render different tabs
	if (activeTab === "share") {
		const orgSlug = survey.organization?.slug;
		if (!orgSlug) {
			return (
				<div className="flex h-full items-center justify-center">
					<div className="text-center">
						<p className="text-muted-foreground">
							Organization information not available
						</p>
					</div>
				</div>
			);
		}
		return (
			<ShareCanvas
				orgSlug={orgSlug}
				surveySlug={survey.slug}
				status={survey.status}
			/>
		);
	}

	if (activeTab === "preview") {
		return <PreviewCanvas questions={safeQuestions} />;
	}

	// Calculate drop position based on overId
	const rawDropIndex = overId
		? safeQuestions.findIndex((q) => q.id === overId)
		: -1;
	const dropIndex = rawDropIndex === -1 ? safeQuestions.length : rawDropIndex;

	// Get the question type being dragged
	const isDraggingPalette = activeDragItem?.type === "palette";
	const draggedQuestionType = isDraggingPalette
		? activeDragItem.questionType
		: undefined;

	return (
		<div
			ref={setNodeRef}
			className={`flex flex-1 flex-col overflow-y-auto bg-muted/30 p-6 transition-colors ${
				isOver ? "bg-primary/5" : ""
			}`}
		>
			<div className="mx-auto w-full max-w-2xl space-y-3">
				<AnimatePresence mode="popLayout" initial={false}>
					{safeQuestions.length === 0 ? (
						<EmptyCanvas
							isOver={isOver}
							onAddQuestion={handleAddQuestion}
							isPending={createMutation.isPending}
						/>
					) : (
						<>
							<SortableContext
								items={safeQuestions.map((q) => q.id)}
								strategy={verticalListSortingStrategy}
							>
								{safeQuestions.map((question, index) => (
									<React.Fragment key={question.id}>
										{/* Add drop indicator before this question if dragging over it */}
										{isDraggingPalette &&
											index === dropIndex &&
											draggedQuestionType && (
												<DropIndicator
													questionType={draggedQuestionType}
													position="middle"
												/>
											)}

										{/* Add the question card */}
										<motion.div
											layout={!activeDragItem ? "position" : false}
											initial={
												question.id.startsWith("temp-")
													? { opacity: 0, y: 20, scale: 0.95 }
													: false
											}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{
												opacity: 0,
												scale: 0.95,
												transition: { duration: 0.15 },
											}}
											transition={{
												type: "spring",
												stiffness: 400,
												damping: 30,
												mass: 0.8,
											}}
										>
											<QuestionCard
												question={question}
												isSelected={selectedQuestionId === question.id}
												onSelect={() => setSelectedQuestionId(question.id)}
												questions={safeQuestions}
												onQuestionsChange={onQuestionsChange}
											/>
										</motion.div>
									</React.Fragment>
								))}

								{/* Add indicator at end if hovering at last position or over canvas */}
								{isDraggingPalette &&
									dropIndex >= safeQuestions.length &&
									draggedQuestionType && (
										<DropIndicator
											questionType={draggedQuestionType}
											position="end"
										/>
									)}
							</SortableContext>

							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.1 }}
							>
								<Button
									variant="outline"
									className="w-full border-dashed"
									onClick={handleAddQuestion}
									disabled={createMutation.isPending}
								>
									<Plus className="mr-2 h-4 w-4" />
									Add Question
								</Button>
							</motion.div>
						</>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}

interface EmptyCanvasProps {
	isOver: boolean;
	onAddQuestion: () => void;
	isPending: boolean;
}

function EmptyCanvas({ isOver, onAddQuestion, isPending }: EmptyCanvasProps) {
	return (
		<motion.div
			key="empty-state"
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			transition={{ duration: 0.2 }}
		>
			<Card
				className={`cursor-pointer border-dashed transition-colors hover:border-primary/50 hover:bg-primary/5 ${
					isOver ? "border-primary/60 bg-primary/10" : ""
				}`}
				onClick={onAddQuestion}
			>
				<CardContent className="flex flex-col items-center justify-center py-16">
					<motion.div
						className="mb-4 rounded-full bg-primary/10 p-4"
						animate={isOver ? { scale: 1.1 } : { scale: 1 }}
						transition={{ type: "spring", stiffness: 400, damping: 17 }}
					>
						<Plus className="h-8 w-8 text-primary" />
					</motion.div>
					<p className="font-semibold text-foreground">
						Add your first question
					</p>
					<p className="mt-1 text-muted-foreground text-sm">
						Click here or drag a question type from the left panel
					</p>
				</CardContent>
			</Card>
		</motion.div>
	);
}
