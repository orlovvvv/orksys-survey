"use client";

import { useQuery } from "@tanstack/react-query";

import { orpc } from "@/utils/orpc";

import { useSurveyAnalytics } from "../providers";

export function useSurveyQuestionQuery(questionId?: string) {
	const { filterParams } = useSurveyAnalytics();

	const queryOptions = orpc.analytics.getQuestionAnalytics.queryOptions({
		input: {
			surveyId: filterParams.surveyIds[0],
			questionId,
		},
	});

	return useQuery({
		...queryOptions,
		enabled: !!questionId,
	});
}

export function useSurveyAllQuestionsQuery() {
	const { filterParams } = useSurveyAnalytics();

	return useQuery(
		orpc.analytics.getQuestionAnalytics.queryOptions({
			input: {
				surveyId: filterParams.surveyIds[0],
			},
		}),
	);
}
