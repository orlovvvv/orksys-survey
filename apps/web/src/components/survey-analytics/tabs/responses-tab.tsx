"use client";

import { ResponseTable } from "@/components/analytics/response-table/main";

import { useSurveyAnalytics } from "../providers";

export function ResponsesTab() {
	const { surveyId, questions } = useSurveyAnalytics();

	return <ResponseTable surveyId={surveyId} questions={questions} />;
}
