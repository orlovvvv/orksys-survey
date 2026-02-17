"use client";

import { useDroppable } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Question } from "@orksys-survey/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ClipboardList, Plus } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { orpc } from "@/utils/orpc";
import { useSurveyBuilder } from "./index";
import { QuestionCard, questionTypeLabels } from "./question-card";

// Drag item types (matching index.tsx)
interface PaletteDragItem {
	type: "palette";
	questionType: Question["type"];
}

interface QuestionDragItem {
	type: "question";
	id: string;
}

type DragItem = PaletteDragItem | QuestionDragItem;

// Drop indicator component with animated glow and question type
interface DropIndicatorProps {
	questionType?: Question["type"];
}

function DropIndicator({ questionType }: DropIndicatorProps) {
	return (
		<motion.div
			initial={{ opacity: 0, height: 0, marginBottom: 0 }}
			animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
			exit={{ opacity: 0, height: 0, marginBottom: 0 }}
			transition={{ type: "spring", stiffness: 400, damping: 30 }}
			className="overflow-hidden pointer-events-none"
		>
			<div className="relative flex min-h-[52px] items-center gap-2 rounded-xl border border-violet-500 bg-violet-50 p-3">
				{/* Animated glow */}
				<motion.div
					className="absolute inset-0 rounded-xl border border-violet-400"
					animate={{ opacity: [0.3, 0.7, 0.3] }}
					transition={{
						duration: 1.5,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
				/>
				<div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-100">
					<Plus className="h-4 w-4 text-violet-600" />
				</div>
				<span className="relative font-medium text-sm text-violet-700">
					{questionType
						? `Drop to add ${questionTypeLabels[questionType] || "question"}`
						: "Drop to add question here"}
				</span>
			</div>
		</motion.div>
	);
}

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

	if (activeTab === "preview") {
		return (
			<div className="flex flex-1 items-center justify-center overflow-y-auto bg-neutral-50 p-8">
				<div className="w-full max-w-2xl">
					<AnimatePresence mode="popLayout">
						{safeQuestions.length === 0 ? (
							<motion.div
								key="empty-preview"
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{ duration: 0.2 }}
							>
								<Card className="border-dashed">
									<CardContent className="flex flex-col items-center justify-center py-16">
										<ClipboardList className="mb-4 h-12 w-12 text-neutral-300" />
										<p className="text-neutral-500">
											Add questions to preview your survey
										</p>
									</CardContent>
								</Card>
							</motion.div>
						) : (
							<div className="space-y-6">
								{safeQuestions.map((question, index) => (
									<motion.div
										key={question.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, x: -100 }}
										transition={{ duration: 0.2, delay: index * 0.05 }}
										layout
									>
										<Card>
											<CardContent className="p-6">
												<div className="mb-4">
													<span className="mb-2 block font-bold text-[10px] text-violet-500 uppercase tracking-widest">
														Question {index + 1} of {safeQuestions.length}
													</span>
													<h2 className="font-semibold text-lg">
														{question.title}
													</h2>
													{question.description && (
														<p className="mt-1 text-neutral-500 text-sm">
															{question.description}
														</p>
													)}
												</div>
												<div className="rounded-lg border border-neutral-200 border-dashed bg-neutral-50 p-4 text-center text-neutral-400 text-sm">
													{question.type.replace("_", " ")} question preview
												</div>
											</CardContent>
										</Card>
									</motion.div>
								))}
							</div>
						)}
					</AnimatePresence>
				</div>
			</div>
		);
	}

	return (
		<div
			ref={setNodeRef}
			className={`flex flex-1 flex-col overflow-y-auto bg-neutral-50/50 p-6 transition-colors ${
				isOver ? "bg-violet-50/50" : ""
			}`}
		>
			<div className="mx-auto w-full max-w-2xl space-y-3">
				<AnimatePresence mode="popLayout">
					{safeQuestions.length === 0 ? (
						<motion.div
							key="empty-state"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.2 }}
						>
							<Card
								className={`cursor-pointer border-dashed transition-colors hover:border-violet-300 hover:bg-violet-50/50 ${
									isOver ? "border-violet-400 bg-violet-50" : ""
								}`}
								onClick={handleAddQuestion}
							>
								<CardContent className="flex flex-col items-center justify-center py-16">
									<motion.div
										className="mb-4 rounded-full bg-violet-100 p-4"
										animate={isOver ? { scale: 1.1 } : { scale: 1 }}
										transition={{ type: "spring", stiffness: 400, damping: 17 }}
									>
										<Plus className="h-8 w-8 text-violet-500" />
									</motion.div>
									<p className="font-semibold text-neutral-900">
										Add your first question
									</p>
									<p className="mt-1 text-neutral-500 text-sm">
										Click here or drag a question type from the left panel
									</p>
								</CardContent>
							</Card>
						</motion.div>
					) : (
						<>
							<LayoutGroup>
								<SortableContext
									items={safeQuestions.map((q) => q.id)}
									strategy={verticalListSortingStrategy}
								>
									{(() => {
										// Calculate drop position based on overId
										const rawDropIndex = overId
											? safeQuestions.findIndex((q) => q.id === overId)
											: -1;
										const dropIndex =
											rawDropIndex === -1 ? safeQuestions.length : rawDropIndex;

										// Get the question type being dragged
										const isDraggingPalette = activeDragItem?.type === "palette";
										const draggedQuestionType = isDraggingPalette
											? activeDragItem.questionType
											: undefined;

										// Build items array with drop indicator at correct position
										const items: React.ReactNode[] = [];

										safeQuestions.forEach((question, index) => {
											// Add drop indicator before this question if dragging over it
											if (isDraggingPalette && index === dropIndex) {
												items.push(
													<DropIndicator
														key="drop-indicator"
														questionType={draggedQuestionType}
													/>,
												);
											}

											// Add the question card
											const isDragging =
												activeDragItem?.type === "question" &&
												activeDragItem.id === question.id;
											items.push(
												<motion.div
													key={question.id}
													layout={!isDragging}
													initial={{ opacity: 0, y: 20, scale: 0.95 }}
													animate={{
														opacity: 1,
														y: 0,
														scale: 1,
													}}
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
												</motion.div>,
											);
										});

										// Add indicator at end if hovering at last position or over canvas
										if (isDraggingPalette && dropIndex >= safeQuestions.length) {
											items.push(
												<DropIndicator
													key="drop-indicator-end"
													questionType={draggedQuestionType}
												/>,
											);
										}

										return items;
									})()}
								</SortableContext>
							</LayoutGroup>

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
