"use client";

import { Progress } from "@/components/ui/progress";
import { useSurveyRunner } from "./context";

export function RunnerProgress() {
	const { settings, visibleQuestions, answers } = useSurveyRunner();

	if (!settings?.showProgressBar) {
		return null;
	}

	// Calculate progress based on answered visible questions
	const answeredCount = visibleQuestions.filter((q) => {
		const answer = answers.get(q.id);
		return answer !== undefined && answer !== null && answer !== "";
	}).length;

	const progress = (answeredCount / visibleQuestions.length) * 100;

	return (
		<div className="px-6 py-3">
			<div className="mx-auto max-w-2xl">
				<div className="mb-1.5 flex items-center justify-between text-neutral-500 text-xs">
					<span>Progress</span>
					<span>{Math.round(progress)}%</span>
				</div>
				<Progress value={progress} max={100} />
			</div>
		</div>
	);
}
