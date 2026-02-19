"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export type SurveyStatus = "draft" | "published" | "closed" | "archived";

export interface SurveysFilters {
	search: string;
	status: SurveyStatus | undefined;
	page: number;
	perPage: number;
}

interface UseSurveysFiltersOptions {
	defaultPerPage?: number;
}

export function useSurveysFilters(options: UseSurveysFiltersOptions = {}) {
	const { defaultPerPage = 10 } = options;
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const filters = useMemo<SurveysFilters>(
		() => ({
			search: searchParams.get("search") ?? "",
			status: (searchParams.get("status") as SurveyStatus) || undefined,
			page: Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10)),
			perPage: Number.parseInt(
				searchParams.get("perPage") ?? String(defaultPerPage),
				10,
			),
		}),
		[searchParams, defaultPerPage],
	);

	const setFilters = useCallback(
		(updates: Partial<SurveysFilters>) => {
			const params = new URLSearchParams(searchParams.toString());

			// Reset page to 1 when filters change (not when changing page directly)
			if ("search" in updates || "status" in updates) {
				params.set("page", "1");
			}

			for (const [key, value] of Object.entries(updates)) {
				if (value === undefined || value === "" || value === null) {
					params.delete(key);
				} else {
					params.set(key, String(value));
				}
			}

			// Use replaceState for shallow URL updates (no server request)
			window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
		},
		[searchParams, pathname],
	);

	const resetFilters = useCallback(() => {
		const params = new URLSearchParams();
		params.set("perPage", String(filters.perPage));
		window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
	}, [pathname, filters.perPage]);

	return {
		filters,
		setFilters,
		resetFilters,
		hasFilters: Boolean(filters.search || filters.status),
	};
}
