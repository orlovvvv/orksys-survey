"use client";

import { AIInsights } from "@/components/analytics/ai-insights/main";

import { useSurveyAnalytics } from "../providers";

export function InsightsTab() {
	const { surveyId, questions } = useSurveyAnalytics();

	return <AIInsights surveyId={surveyId} questions={questions} />;
}
