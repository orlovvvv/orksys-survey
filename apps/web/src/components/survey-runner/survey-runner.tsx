"use client";

import type { LogicRule, Question, Survey } from "@orksys-survey/db";
import { useCallback } from "react";

import { SurveyRunnerProvider } from "./context";
import { RunnerCanvas } from "./runner-canvas";
import { RunnerHeader } from "./runner-header";
import { RunnerNavigation } from "./runner-navigation";
import { RunnerProgress } from "./runner-progress";

interface SurveyRunnerProps {
	survey: Survey;
	questions: Question[];
	logicRules?: LogicRule[];
	className?: string;
	onComplete?: () => void;
}

function SurveyRunnerComponent({
	survey,
	questions,
	logicRules = [],
	className,
	onComplete,
}: SurveyRunnerProps) {
	const handleComplete = useCallback(() => {
		onComplete?.();
	}, [onComplete]);

	return (
		<SurveyRunnerProvider
			survey={survey}
			questions={questions}
			logicRules={logicRules}
			onComplete={handleComplete}
		>
			<div className={`flex h-screen flex-col ${className ?? ""}`}>
				<RunnerHeader />
				<RunnerProgress />
				<RunnerCanvas />
				<RunnerNavigation />
			</div>
		</SurveyRunnerProvider>
	);
}

// Export the component
export { SurveyRunnerComponent };
export default SurveyRunnerComponent;

export type { AnswerValue } from "./context";
export { SurveyRunnerProvider, useSurveyRunner } from "./context";
export { QuestionRenderer } from "./question-renderer";
// Re-export sub-components for compound pattern
export { RunnerCanvas } from "./runner-canvas";
export { RunnerComplete } from "./runner-complete";
export { RunnerHeader } from "./runner-header";
export { RunnerNavigation } from "./runner-navigation";
export { RunnerProgress } from "./runner-progress";
