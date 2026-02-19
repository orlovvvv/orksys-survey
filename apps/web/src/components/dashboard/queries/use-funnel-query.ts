"use client";

import { useQuery } from "@tanstack/react-query";

import { orpc } from "@/utils/orpc";

import type { DashboardFilterParams } from "../providers";

export function useFunnelQuery(filters: DashboardFilterParams) {
	return useQuery(
		orpc.dashboard.getFunnel.queryOptions({
			input: {
				days: filters.days,
				surveyIds: filters.surveyIds,
			},
		}),
	);
}
