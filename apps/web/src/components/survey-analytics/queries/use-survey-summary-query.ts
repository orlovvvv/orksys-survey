"use client";

import { useQuery } from "@tanstack/react-query";

import { orpc } from "@/utils/orpc";

import { useSurveyAnalytics } from "../providers";

export function useSurveySummaryQuery() {
	const { filterParams } = useSurveyAnalytics();

	return useQuery(
		orpc.analytics.getSummary.queryOptions({
			input: { surveyId: filterParams.surveyIds[0] },
		}),
	);
}
