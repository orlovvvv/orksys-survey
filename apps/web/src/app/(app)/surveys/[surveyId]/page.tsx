"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { use } from "react";
import {
	SurveyBuilder,
	SurveyBuilderContext,
	useSurveyBuilderActor,
} from "@/components/survey-builder";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { orpc } from "@/utils/orpc";

// Inner component to consume the context for responsive rendering
function SurveyBuilderLayout() {
	const send = useSurveyBuilderActor().send;
	const activeTab = SurveyBuilderContext.useSelector(
		(s) => s.context.activeTab,
	);
	const paletteOpen = SurveyBuilderContext.useSelector(
		(s) => s.context.paletteOpen,
	);
	const propertiesOpen = SurveyBuilderContext.useSelector(
		(s) => s.context.propertiesOpen,
	);
	const isDesktop = useMediaQuery("(min-width: 1024px)");

	return (
		<SurveyBuilder.DndCore>
			<SurveyBuilder.Frame>
				<SurveyBuilder.Header />

				<div className="flex flex-1 overflow-hidden pb-20">
					{/* Left Palette - Responsive */}
					{activeTab === "build" && (
						<>
							{isDesktop && <SurveyBuilder.Palette />}
							{!isDesktop && (
								<Sheet
									open={paletteOpen}
									onOpenChange={(open) =>
										send({ type: "TOGGLE_PALETTE", open })
									}
								>
									<SheetContent side="left" className="w-72 p-0">
										<SurveyBuilder.Palette />
									</SheetContent>
								</Sheet>
							)}
						</>
					)}

					{/* Canvas */}
					<SurveyBuilder.Canvas />

					{/* Right Properties Panel - Responsive */}
					{activeTab === "build" && (
						<>
							{isDesktop && <SurveyBuilder.Properties />}
							{!isDesktop && (
								<Sheet
									open={propertiesOpen}
									onOpenChange={(open) =>
										send({ type: "TOGGLE_PROPERTIES", open })
									}
								>
									<SheetContent side="right" className="w-80 p-0">
										<SurveyBuilder.Properties />
									</SheetContent>
								</Sheet>
							)}
						</>
					)}
				</div>

				{/* Bottom Bar - Save/Publish/Discard */}
				<SurveyBuilder.BottomBar />
			</SurveyBuilder.Frame>
		</SurveyBuilder.DndCore>
	);
}

export default function SurveyBuilderPage({
	params,
}: {
	params: Promise<{ surveyId: string }>;
}) {
	const { surveyId } = use(params);

	const survey = useQuery(
		orpc.survey.getById.queryOptions({ input: { id: surveyId } }),
	);

	const questions = useQuery(
		orpc.question.list.queryOptions({ input: { surveyId } }),
	);

	if (survey.isLoading || questions.isLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (survey.isError || !survey.data) {
		notFound();
	}

	return (
		<SurveyBuilder.Provider
			survey={survey.data}
			initialQuestions={questions.data || []}
		>
			<SurveyBuilderLayout />
		</SurveyBuilder.Provider>
	);
}
