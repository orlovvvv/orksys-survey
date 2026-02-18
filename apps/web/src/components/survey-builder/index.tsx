"use client";

import {
	DndContext,
	DragOverlay,
	defaultDropAnimation,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { Question } from "@orksys-survey/db";
import { PanelLeftClose, PanelRightClose } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

import { BuilderCanvas } from "./builder-canvas";
import { BuilderHeader } from "./builder-header";
import { SurveyBuilderProvider } from "./context";
import { DragOverlayRenderer } from "./drag-overlay-renderer";
import { useDragHandlers } from "./hooks/use-drag-handlers";
import { useQuestionMutations } from "./hooks/use-question-mutations";
import { PropertiesPanel } from "./properties-panel";
import { QuestionPalette } from "./question-palette";
import type { SurveyWithOrganization } from "./types";

interface SurveyBuilderProps {
	survey: SurveyWithOrganization;
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
	const [activeTab, setActiveTab] = useState<"build" | "preview" | "share">(
		"build",
	);
	const [questions, setQuestions] = useState(initialQuestions);
	const [paletteOpen, setPaletteOpen] = useState(false);
	const [propertiesOpen, setPropertiesOpen] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);

	// Responsive breakpoints
	const isDesktop = useMediaQuery("(min-width: 1024px)");

	// Sync state when initialQuestions changes
	useEffect(() => {
		setQuestions(initialQuestions);
	}, [initialQuestions]);

	// Get mutations
	const { reorderMutation } = useQuestionMutations({
		survey,
		onQuestionCreated: (newQuestion) => {
			// Replace optimistic question with real one
			setQuestions((currentQuestions) => {
				const tempId = selectedQuestionId?.startsWith("temp-")
					? selectedQuestionId
					: null;
				if (!tempId) return currentQuestions;

				return currentQuestions.map((q) => (q.id === tempId ? newQuestion : q));
			});

			setSelectedQuestionId((currentId) => {
				const tempId = currentId?.startsWith("temp-") ? currentId : null;
				return tempId ? newQuestion.id : currentId;
			});
		},
		onQuestionCreateError: () => {
			// Revert on error
			if (selectedQuestionId?.startsWith("temp-")) {
				setSelectedQuestionId(null);
			}
		},
	});

	// Get drag handlers
	const {
		activeDragItem,
		overId,
		collisionDetection,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
	} = useDragHandlers({
		questions,
		setQuestions,
		survey,
		selectedQuestionId,
		setSelectedQuestionId,
		reorderMutation,
	});

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

	const safeQuestions = questions || [];

	return (
		<SurveyBuilderProvider
			survey={survey}
			questions={questions}
			selectedQuestionId={selectedQuestionId}
			setSelectedQuestionId={setSelectedQuestionId}
			activeTab={activeTab}
			setActiveTab={setActiveTab}
			onQuestionsChange={setQuestions}
			paletteOpen={paletteOpen}
			setPaletteOpen={setPaletteOpen}
			propertiesOpen={propertiesOpen}
			setPropertiesOpen={setPropertiesOpen}
			settingsOpen={settingsOpen}
			setSettingsOpen={setSettingsOpen}
		>
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
					<DragOverlayRenderer
						activeDragItem={activeDragItem}
						questions={safeQuestions}
						selectedQuestionId={selectedQuestionId}
					/>
				</DragOverlay>
			</DndContext>
		</SurveyBuilderProvider>
	);
}

// Re-export sub-components for compound pattern
export { BuilderCanvas } from "./builder-canvas";
export { BuilderHeader } from "./builder-header";
export type { TabValue } from "./builder-header/builder-tabs";
export { useSurveyBuilder } from "./context";
export { useDragHandlers } from "./hooks/use-drag-handlers";
export { useQuestionMutations } from "./hooks/use-question-mutations";
export { PropertiesPanel } from "./properties-panel";
export { QuestionPalette } from "./question-palette";
// Re-export types and hooks for external use
export type { DragItem, SurveyBuilderContextValue } from "./types";
