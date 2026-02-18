"use client";

import type { Question } from "@orksys-survey/db";
import { useSurveyRunner } from "./context";
import { QuestionRenderer } from "./question-renderer";

function OneAtATimeCanvas() {
	const { visibleQuestions, currentQuestionIndex } = useSurveyRunner();

	// Find the current visible question
	const currentVisibleIndex = Math.min(
		currentQuestionIndex,
		visibleQuestions.length - 1,
	);
	const currentQuestion = visibleQuestions[currentVisibleIndex];

	if (!currentQuestion) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<p className="text-muted-foreground">No questions available</p>
			</div>
		);
	}

	return (
		<div className="flex-1 overflow-y-auto px-6 py-8">
			<div className="mx-auto max-w-2xl">
				<QuestionRenderer question={currentQuestion} />
			</div>
		</div>
	);
}

function ListModeCanvas({ questions }: { questions: Question[] }) {
	if (questions.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<p className="text-muted-foreground">No questions available</p>
			</div>
		);
	}

	return (
		<div className="flex-1 overflow-y-auto px-6 py-8">
			<div className="mx-auto max-w-2xl space-y-8">
				{questions.map((question) => (
					<div key={question.id}>
						<QuestionRenderer question={question} />
					</div>
				))}
			</div>
		</div>
	);
}

export function RunnerCanvas() {
	const { displayMode, visibleQuestions } = useSurveyRunner();

	if (displayMode === "list") {
		return <ListModeCanvas questions={visibleQuestions} />;
	}

	return <OneAtATimeCanvas />;
}
