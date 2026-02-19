"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type TimeRange = "7d" | "30d" | "90d" | "all";

export interface SurveyOption {
	id: string;
	title: string;
	slug: string;
}

export interface DashboardFilterParams {
	days: number | undefined;
	surveyIds: string[] | undefined;
}

interface DashboardFiltersContextValue {
	timeRange: TimeRange;
	setTimeRange: (range: TimeRange) => void;
	selectedSurveys: string[];
	setSelectedSurveys: (ids: string[]) => void;
	availableSurveys: SurveyOption[];
	filterParams: DashboardFilterParams;
}

const DashboardFiltersContext =
	createContext<DashboardFiltersContextValue | null>(null);

export function useDashboardFilters(): DashboardFiltersContextValue {
	const context = useContext(DashboardFiltersContext);
	if (!context) {
		throw new Error(
			"useDashboardFilters must be used within DashboardFiltersProvider",
		);
	}
	return context;
}

function getDaysFromTimeRange(range: TimeRange): number | undefined {
	switch (range) {
		case "7d":
			return 7;
		case "30d":
			return 30;
		case "90d":
			return 90;
		case "all":
			return undefined;
	}
}

export function DashboardFiltersProvider({
	children,
	availableSurveys = [],
}: {
	children: React.ReactNode;
	availableSurveys?: SurveyOption[];
}) {
	const [timeRange, setTimeRange] = useState<TimeRange>("30d");
	const [selectedSurveys, setSelectedSurveys] = useState<string[]>([]);

	const filterParams = useMemo<DashboardFilterParams>(() => {
		const days = getDaysFromTimeRange(timeRange);
		const surveyFilter =
			selectedSurveys.length > 0 ? selectedSurveys : undefined;
		return { days, surveyIds: surveyFilter };
	}, [timeRange, selectedSurveys]);

	const value = useMemo(
		() => ({
			timeRange,
			setTimeRange,
			selectedSurveys,
			setSelectedSurveys,
			availableSurveys,
			filterParams,
		}),
		[timeRange, selectedSurveys, availableSurveys, filterParams],
	);

	return (
		<DashboardFiltersContext.Provider value={value}>
			{children}
		</DashboardFiltersContext.Provider>
	);
}
