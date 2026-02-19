"use client";

import { useSurveyAnalytics } from "../providers";
import { QuestionMetricsWidget } from "../widgets/question-metrics-widget";

export function QuestionsTab() {
	const { questions } = useSurveyAnalytics();

	if (questions.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
				<p className="text-muted-foreground text-sm">
					No questions in this survey yet
				</p>
			</div>
		);
	}

	return (
		<div className="grid gap-6 md:grid-cols-2">
			{questions.map((question) => (
				<QuestionMetricsWidget key={question.id} questionId={question.id} />
			))}
		</div>
	);
}
