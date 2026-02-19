"use client";

import type { Question, Survey } from "@orksys-survey/db";
import { createContext, useContext, useMemo, useState } from "react";

export type TimeRange = "7d" | "30d" | "90d" | "all";

interface SurveyAnalyticsContextValue {
	surveyId: string;
	timeRange: TimeRange;
	setTimeRange: (range: TimeRange) => void;
	filterParams: {
		days: number | undefined;
		surveyIds: [string];
	};
	survey: Survey | undefined;
	questions: Question[];
	setSurvey: (survey: Survey) => void;
	setQuestions: (questions: Question[]) => void;
}

const SurveyAnalyticsContext =
	createContext<SurveyAnalyticsContextValue | null>(null);

export function useSurveyAnalytics(): SurveyAnalyticsContextValue {
	const context = useContext(SurveyAnalyticsContext);
	if (!context) {
		throw new Error(
			"useSurveyAnalytics must be used within SurveyAnalyticsProvider",
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

export function SurveyAnalyticsProvider({
	surveyId,
	children,
}: {
	surveyId: string;
	children: React.ReactNode;
}) {
	const [timeRange, setTimeRange] = useState<TimeRange>("30d");
	const [survey, setSurvey] = useState<Survey | undefined>();
	const [questions, setQuestions] = useState<Question[]>([]);

	const filterParams = useMemo(
		() => ({
			days: getDaysFromTimeRange(timeRange),
			surveyIds: [surveyId] as [string],
		}),
		[surveyId, timeRange],
	);

	const value = useMemo(
		() => ({
			surveyId,
			timeRange,
			setTimeRange,
			filterParams,
			survey,
			questions,
			setSurvey,
			setQuestions,
		}),
		[surveyId, timeRange, filterParams, survey, questions],
	);

	return (
		<SurveyAnalyticsContext.Provider value={value}>
			{children}
		</SurveyAnalyticsContext.Provider>
	);
}
