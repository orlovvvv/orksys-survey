"use client";

import { DemographicsPanel } from "@/components/analytics/demographics";

import { useSurveyAnalytics } from "../providers";

export function DemographicsTab() {
	const { surveyId } = useSurveyAnalytics();

	return <DemographicsPanel surveyId={surveyId} />;
}
