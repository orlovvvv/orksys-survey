"use client";

import { useQuery } from "@tanstack/react-query";

import { client } from "@/utils/orpc";

export interface UsageStats {
	surveysCount: number;
	responsesThisMonth: number;
	surveysLimit: number;
	responsesLimit: number;
	surveysDisplay: string;
	responsesDisplay: string;
}

export interface UseUsageStatsResult {
	data: UsageStats | null;
	isLoading: boolean;
	error: Error | null;
}

// Free tier limits
const FREE_SURVEYS_LIMIT = 3;
const FREE_RESPONSES_LIMIT = 100;

/**
 * Fetches usage statistics for the current organization.
 * For Pro users, shows unlimited access message.
 */
export function useUsageStats(isPro: boolean): UseUsageStatsResult {
	const query = useQuery({
		queryKey: ["usageStats"],
		queryFn: async () => {
			const result = await client.usage.getStats({});
			return result;
		},
		staleTime: 1000 * 60 * 5, // 5 minutes
		enabled: !isPro, // Only fetch if not Pro
	});

	if (isPro) {
		return {
			data: {
				surveysCount: 0,
				responsesThisMonth: 0,
				surveysLimit: FREE_SURVEYS_LIMIT,
				responsesLimit: FREE_RESPONSES_LIMIT,
				surveysDisplay: "Unlimited",
				responsesDisplay: "Unlimited",
			},
			isLoading: false,
			error: null,
		};
	}

	const surveysCount = query.data?.surveysCount ?? 0;
	const responsesThisMonth = query.data?.responsesThisMonth ?? 0;

	return {
		data: {
			surveysCount,
			responsesThisMonth,
			surveysLimit: FREE_SURVEYS_LIMIT,
			responsesLimit: FREE_RESPONSES_LIMIT,
			surveysDisplay: `${surveysCount} of ${FREE_SURVEYS_LIMIT}`,
			responsesDisplay: `${responsesThisMonth} of ${FREE_RESPONSES_LIMIT}`,
		},
		isLoading: query.isLoading,
		error: query.error ?? null,
	};
}
