"use client";

import { useQuery } from "@tanstack/react-query";

import { orpc } from "@/utils/orpc";

import { useSurveyAnalytics } from "../providers";

export function useSurveyTrendsQuery() {
	const { filterParams } = useSurveyAnalytics();

	return useQuery(
		orpc.analytics.getTrends.queryOptions({
			input: {
				surveyId: filterParams.surveyIds[0],
				days: filterParams.days ?? 30,
			},
		}),
	);
}
