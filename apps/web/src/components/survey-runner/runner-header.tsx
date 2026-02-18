"use client";

import { useSurveyRunner } from "./context";

export function RunnerHeader() {
	const { survey, settings, visibleQuestions, currentQuestionIndex } =
		useSurveyRunner();
	const currentVisibleIndex = visibleQuestions.findIndex(
		(q) => q.order === visibleQuestions[currentQuestionIndex]?.order,
	);

	return (
		<header className="border-neutral-200 border-b bg-white px-6 py-4">
			<div className="mx-auto max-w-2xl">
				<h1 className="font-semibold text-neutral-900 text-xl">
					{survey.title}
				</h1>
				{survey.description && (
					<p className="mt-1 text-neutral-600 text-sm">{survey.description}</p>
				)}
				{settings?.showQuestionNumbers && (
					<p className="mt-2 text-neutral-500 text-xs">
						Question {currentVisibleIndex + 1} of {visibleQuestions.length}
					</p>
				)}
			</div>
		</header>
	);
}
