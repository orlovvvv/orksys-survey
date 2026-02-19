"use client";

import { useQuery } from "@tanstack/react-query";

import { orpc } from "@/utils/orpc";

import type { DashboardFilterParams } from "../providers";

export function useTrendsQuery(filters: DashboardFilterParams) {
	return useQuery(
		orpc.dashboard.getTrends.queryOptions({
			input: {
				days: filters.days ?? 30,
				surveyIds: filters.surveyIds,
			},
		}),
	);
}
