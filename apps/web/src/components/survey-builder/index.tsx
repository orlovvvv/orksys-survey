"use client";

import {
	type CollisionDetection,
	closestCenter,
	DndContext,
	type DragEndEvent,
	type DragOverEvent,
	DragOverlay,
	type DragStartEvent,
	defaultDropAnimation,
	KeyboardSensor,
	PointerSensor,
	pointerWithin,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { Question, Survey } from "@orksys-survey/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PanelLeftClose, PanelRightClose } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { client, orpc } from "@/utils/orpc";
import { BuilderCanvas } from "./builder-canvas";
import { BuilderHeader } from "./builder-header";
import { PropertiesPanel } from "./properties-panel";
import { QuestionCardContent, questionTypeLabels } from "./question-card";
import { QuestionPalette } from "./question-palette";
import { createMockQuestion } from "./utils";

// Builder context for sharing state across components
interface SurveyBuilderContextValue {
	survey: Survey;
	questions: Question[];
	selectedQuestionId: string | null;
	setSelectedQuestionId: (id: string | null) => void;
	activeTab: "build" | "preview";
	setActiveTab: (tab: "build" | "preview") => void;
	onQuestionsChange: (questions: Question[]) => void;
	paletteOpen: boolean;
	setPaletteOpen: (open: boolean) => void;
	propertiesOpen: boolean;
	setPropertiesOpen: (open: boolean) => void;
}

const SurveyBuilderContext = createContext<SurveyBuilderContextValue | null>(
	null,
);

export function useSurveyBuilder() {
	const context = useContext(SurveyBuilderContext);
	if (!context) {
		throw new Error(
			"useSurveyBuilder must be used within a SurveyBuilder component",
		);
	}
	return context;
}

// Drag item types
interface PaletteDragItem {
	type: "palette";
	questionType: Question["type"];
}

interface QuestionDragItem {
	type: "question";
	id: string;
}

type DragItem = PaletteDragItem | QuestionDragItem;

interface SurveyBuilderProps {
	survey: Survey;
	questions: Question[];
	className?: string;
}

export function SurveyBuilder({
	survey,
	questions: initialQuestions,
	className,
}: SurveyBuilderProps) {
	const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
		null,
	);
	const [activeTab, setActiveTab] = useState<"build" | "preview">("build");
	const [questions, setQuestions] = useState(initialQuestions);
	const [activeDragItem, setActiveDragItem] = useState<DragItem | null>(null);
	const [overId, setOverId] = useState<string | null>(null);
	const [paletteOpen, setPaletteOpen] = useState(false);
	const [propertiesOpen, setPropertiesOpen] = useState(false);

	// Responsive breakpoints
	const isDesktop = useMediaQuery("(min-width: 1024px)");

	const queryClient = useQueryClient();

	// Sync state when initialQuestions changes
	useEffect(() => {
		setQuestions(initialQuestions);
	}, [initialQuestions]);

	// Reorder mutation
	const reorderMutation = useMutation(
		orpc.question.reorder.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["question"] });
			},
			onError: (error) => {
				toast.error(error.message || "Failed to reorder questions");
			},
		}),
	);

	// DnD sensors
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	// Custom collision detection: pointerWithin for palette drops, closestCenter for canvas reordering
	const collisionDetection: CollisionDetection = (args) => {
		// If dragging from palette (has questionType), use pointerWithin for cross-container drops
		if (args.active.data.current?.questionType) {
			const pointerCollisions = pointerWithin(args);
			if (pointerCollisions.length > 0) {
				return pointerCollisions;
			}
		}
		// For canvas reordering, use closestCenter for better sortable behavior
		return closestCenter(args);
	};

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		const data = active.data.current;

		if (data?.questionType) {
			// Dragging from palette
			setActiveDragItem({
				type: "palette",
				questionType: data.questionType as Question["type"],
			});
		} else {
			// Dragging existing question
			setActiveDragItem({
				type: "question",
				id: active.id as string,
			});
		}
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { over } = event;
		setOverId(over?.id as string | null);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setOverId(null);

		if (!over) {
			setActiveDragItem(null);
			return;
		}

		// Handle cancel drop
		if (over.id === "palette-cancel-zone") {
			setActiveDragItem(null);
			return;
		}

		// Handle palette drop (from question type palette) - use tracked drop index
		if (active.data.current?.questionType) {
			const questionType = active.data.current.questionType as Question["type"];

			// Calculate insert index based on over.id
			const overIndex = questions.findIndex((q) => q.id === over.id);
			const insertIndex = overIndex === -1 ? questions.length : overIndex;

			// Optimistic update
			const tempId = `temp-${crypto.randomUUID()}`;
			const mockQuestion = createMockQuestion(questionType);
			const optimisticQuestion = { ...mockQuestion, id: tempId };

			const optimisticQuestions = [
				...questions.slice(0, insertIndex).map((q, i) => ({ ...q, order: i })),
				{ ...optimisticQuestion, order: insertIndex },
				...questions
					.slice(insertIndex)
					.map((q, i) => ({ ...q, order: insertIndex + 1 + i })),
			];

			setQuestions(optimisticQuestions);
			setSelectedQuestionId(tempId);

			// Create question and reorder
			client.question
				.create({
					surveyId: survey.id,
					type: questionType,
					title: `New ${questionTypeLabels[questionType] || questionType}`,
					order: insertIndex,
				})
				.then((newQuestion) => {
					// Replace optimistic question with real one
					setQuestions((currentQuestions) => {
						const updatedQuestions = currentQuestions.map((q) =>
							q.id === tempId ? newQuestion : q,
						);
						return updatedQuestions;
					});

					setSelectedQuestionId((currentId) =>
						currentId === tempId ? newQuestion.id : currentId,
					);

					queryClient.invalidateQueries({ queryKey: ["question"] });

					// Reorder all questions on backend to ensure consistency
					const finalQuestions = [
						...questions
							.slice(0, insertIndex)
							.map((q, i) => ({ ...q, order: i })),
						{ ...newQuestion, order: insertIndex },
						...questions
							.slice(insertIndex)
							.map((q, i) => ({ ...q, order: insertIndex + 1 + i })),
					];

					reorderMutation.mutate({
						questions: finalQuestions.map((q) => ({
							id: q.id,
							order: q.order,
						})),
					});

					toast.success("Question added");
				})
				.catch((error: Error) => {
					// Revert on error
					setQuestions(questions);
					if (selectedQuestionId === tempId) setSelectedQuestionId(null);
					toast.error(error.message || "Failed to create question");
				});

			setActiveDragItem(null);
			return;
		}

		// Handle reordering
		if (active.id !== over.id && over.id !== "canvas") {
			const oldIndex = questions.findIndex((q) => q.id === active.id);
			const newIndex = questions.findIndex((q) => q.id === over.id);

			if (oldIndex !== -1 && newIndex !== -1) {
				const newQuestions = arrayMove(questions, oldIndex, newIndex).map(
					(q, index) => {
						// Only create new object if order actually changed
						if (q.order === index) {
							return q; // Preserve reference
						}
						return { ...q, order: index };
					},
				);

				setQuestions(newQuestions);

				reorderMutation.mutate({
					questions: newQuestions.map((q) => ({
						id: q.id,
						order: q.order,
					})),
				});
			}
		}

		setActiveDragItem(null); // Always called last
	};

	const contextValue: SurveyBuilderContextValue = {
		survey,
		questions,
		selectedQuestionId,
		setSelectedQuestionId,
		activeTab,
		setActiveTab,
		onQuestionsChange: setQuestions,
		paletteOpen,
		setPaletteOpen,
		propertiesOpen,
		setPropertiesOpen,
	};

	const safeQuestions = questions || [];

	// Render drag overlay
	const renderDragOverlay = () => {
		if (!activeDragItem) return null;

		if (activeDragItem.type === "palette") {
			const mockQuestion = createMockQuestion(activeDragItem.questionType);
			return (
				<div className="w-[calc(100vw-3rem)] max-w-2xl">
					<QuestionCardContent
						question={mockQuestion}
						isSelected={false}
						hasLogic={false}
						isOverlay={true}
					/>
				</div>
			);
		}

		// Dragging existing question
		const activeQuestion = safeQuestions.find(
			(q) => q.id === activeDragItem.id,
		);
		if (activeQuestion) {
			return (
				<div className="w-[calc(100vw-3rem)] max-w-2xl">
					<QuestionCardContent
						question={activeQuestion}
						isSelected={selectedQuestionId === activeQuestion.id}
						hasLogic={false}
						isOverlay={true}
					/>
				</div>
			);
		}

		return null;
	};

	return (
		<SurveyBuilderContext.Provider value={contextValue}>
			<DndContext
				sensors={sensors}
				collisionDetection={collisionDetection}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
			>
				<div className={cn("flex h-full flex-col", className)}>
					<BuilderHeader
						leftActions={
							!isDesktop &&
							activeTab === "build" && (
								<div className="flex items-center gap-1">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setPaletteOpen(!paletteOpen)}
									>
										<PanelLeftClose className="h-4 w-4" />
									</Button>
								</div>
							)
						}
						rightActions={
							!isDesktop &&
							activeTab === "build" && (
								<div className="flex items-center gap-1">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setPropertiesOpen(!propertiesOpen)}
									>
										<PanelRightClose className="h-4 w-4" />
									</Button>
								</div>
							)
						}
					/>
					<div className="flex flex-1 overflow-hidden">
						{/* Left Palette - Responsive */}
						{activeTab === "build" && (
							<>
								{/* Desktop: Fixed sidebar */}
								{isDesktop && <QuestionPalette />}

								{/* Tablet/Mobile: Sheet overlay */}
								{!isDesktop && (
									<Sheet open={paletteOpen} onOpenChange={setPaletteOpen}>
										<SheetContent side="left" className="w-72 p-0">
											<QuestionPalette />
										</SheetContent>
									</Sheet>
								)}
							</>
						)}

						{/* Canvas */}
						<BuilderCanvas
							questions={questions}
							onQuestionsChange={setQuestions}
							activeDragItem={activeDragItem}
							overId={overId}
						/>

						{/* Right Properties Panel - Responsive */}
						{activeTab === "build" && (
							<>
								{/* Desktop: Fixed sidebar */}
								{isDesktop && <PropertiesPanel />}

								{/* Tablet/Mobile: Sheet overlay */}
								{!isDesktop && (
									<Sheet open={propertiesOpen} onOpenChange={setPropertiesOpen}>
										<SheetContent side="right" className="w-80 p-0">
											<PropertiesPanel />
										</SheetContent>
									</Sheet>
								)}
							</>
						)}
					</div>
				</div>

				<DragOverlay dropAnimation={defaultDropAnimation}>
					{renderDragOverlay()}
				</DragOverlay>
			</DndContext>
		</SurveyBuilderContext.Provider>
	);
}

export { BuilderCanvas } from "./builder-canvas";
// Re-export sub-components for compound pattern
export { BuilderHeader } from "./builder-header";
export { PropertiesPanel } from "./properties-panel";
export { QuestionPalette } from "./question-palette";
