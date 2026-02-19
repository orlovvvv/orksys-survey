"use client";

import { OverviewStatsGrid } from "../widgets";
import { ResponseFunnelWidget } from "../widgets/response-funnel-widget";
import { SurveyTrendsWidget } from "../widgets/survey-trends-widget";

export function OverviewTab() {
	return (
		<div className="space-y-6">
			{/* Stats Grid */}
			<OverviewStatsGrid />

			{/* Two column layout: Funnel + Trends */}
			<div className="grid gap-6 lg:grid-cols-2">
				<ResponseFunnelWidget />
				<SurveyTrendsWidget />
			</div>
		</div>
	);
}
