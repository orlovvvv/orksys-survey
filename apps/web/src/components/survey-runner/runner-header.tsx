"use client";

import { useSurveyRunner } from "./context";

export function RunnerHeader() {
	const { survey, settings, visibleQuestions, currentQuestionIndex } =
		useSurveyRunner();
	const currentVisibleIndex = visibleQuestions.findIndex(
		(q) => q.order === visibleQuestions[currentQuestionIndex]?.order,
	);

	return (
		<header className="border-border border-b bg-card px-6 py-4">
			<div className="mx-auto max-w-2xl">
				<h1 className="font-semibold text-foreground text-xl">
					{survey.title}
				</h1>
				{survey.description && (
					<p className="mt-1 text-muted-foreground text-sm">
						{survey.description}
					</p>
				)}
				{settings?.showQuestionNumbers && (
					<p className="mt-2 text-muted-foreground text-xs">
						Question {currentVisibleIndex + 1} of {visibleQuestions.length}
					</p>
				)}
			</div>
		</header>
	);
}
