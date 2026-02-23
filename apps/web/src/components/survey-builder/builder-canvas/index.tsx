"use client";

import { useDroppable } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Question } from "@orksys-survey/db";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SurveyBuilderContext } from "../context";
import { useQuestionMutations } from "../hooks/use-question-mutations";
import { QuestionCard } from "../question-card";
import { PreviewCanvas } from "./preview-canvas";
import { ShareCanvas } from "./share-canvas";

interface RenderableItem {
	question: Question;
	isPreview: boolean;
}

export function BuilderCanvas() {
	const send = SurveyBuilderContext.useActorRef().send;
	const survey = SurveyBuilderContext.useSelector((s) => s.context.survey);
	const selectedQuestionId = SurveyBuilderContext.useSelector(
		(s) => s.context.selectedQuestionId,
	);
	const activeTab = SurveyBuilderContext.useSelector(
		(s) => s.context.activeTab,
	);
	const questions = SurveyBuilderContext.useSelector(
		(s) => s.context.questions,
	);
	const activeDragItem = SurveyBuilderContext.useSelector(
		(s) => s.context.activeDragItem,
	);
	const pendingQuestion = SurveyBuilderContext.useSelector(
		(s) => s.context.pendingQuestion,
	);

	// Make canvas droppable
	const { setNodeRef, isOver } = useDroppable({
		id: "canvas",
	});

	const safeQuestions = useMemo(() => questions ?? [], [questions]);

	const { addQuestion } = useQuestionMutations();

	const handleAddQuestion = () => {
		addQuestion("text", safeQuestions.length);
	};

	// Merge pending question with real questions for rendering
	const renderableItems: RenderableItem[] = useMemo(() => {
		if (!pendingQuestion) {
			return safeQuestions.map((q) => ({ question: q, isPreview: false }));
		}

		const { insertIndex, ...questionData } = pendingQuestion;
		const items = [
			...safeQuestions.map((q) => ({ question: q, isPreview: false })),
		];
		items.splice(insertIndex, 0, {
			question: questionData as Question,
			isPreview: true,
		});
		return items;
	}, [safeQuestions, pendingQuestion]);

	// Get sortable IDs (exclude preview items from sortable context)
	const sortableIds = useMemo(
		() => safeQuestions.map((q: Question) => q.id),
		[safeQuestions],
	);

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

	return (
		<div
			ref={setNodeRef}
			className={`flex flex-1 flex-col overflow-y-auto bg-muted/30 p-6 transition-colors ${
				isOver ? "bg-primary/5" : ""
			}`}
		>
			<div className="mx-auto w-full max-w-2xl space-y-3">
				<AnimatePresence mode="popLayout" initial={false}>
					{renderableItems.length === 0 ? (
						<EmptyCanvas isOver={isOver} onAddQuestion={handleAddQuestion} />
					) : (
						<>
							<SortableContext
								items={sortableIds}
								strategy={verticalListSortingStrategy}
							>
								{renderableItems.map((item) => {
									const { question, isPreview } = item;
									return (
										<motion.div
											key={question.id}
											layout={false}
											initial={isPreview ? { opacity: 0, scale: 0.95 } : false}
											animate={{ opacity: isPreview ? 0.6 : 1, scale: 1 }}
											exit={{
												opacity: 0,
												scale: 0.95,
												transition: { duration: 0.15 },
											}}
											transition={{
												type: "tween",
												duration: 0.15,
												ease: "easeOut",
											}}
										>
											<QuestionCard
												question={question}
												isSelected={selectedQuestionId === question.id}
												onSelect={() =>
													send({ type: "SELECT_QUESTION", id: question.id })
												}
												questions={safeQuestions}
												onQuestionsChange={(newQuestions) =>
													send({
														type: "QUESTIONS_SET",
														questions: newQuestions,
													})
												}
												isPlaceholder={isPreview}
											/>
										</motion.div>
									);
								})}
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
}

function EmptyCanvas({ isOver, onAddQuestion }: EmptyCanvasProps) {
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
