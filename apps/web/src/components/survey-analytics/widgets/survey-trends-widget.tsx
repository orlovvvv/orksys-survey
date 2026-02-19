"use client";

import { TrendingUp } from "lucide-react";
import { LineChart } from "@/components/charts/line-chart";
import { useSurveyTrendsQuery } from "../queries";
import { formatDate } from "../utils/formatters";
import {
	WidgetCard,
	WidgetEmpty,
	WidgetError,
	WidgetLoading,
	WidgetRefreshButton,
} from "../widget-parts";

export function SurveyTrendsWidget() {
	const trends = useSurveyTrendsQuery();

	const handleRefresh = () => {
		trends.refetch();
	};

	if (trends.isLoading) {
		return (
			<WidgetCard title="Response Trends">
				<WidgetLoading type="chart" height={250} />
			</WidgetCard>
		);
	}

	if (trends.error) {
		return (
			<WidgetCard title="Response Trends">
				<WidgetError
					title="Unable to load trends"
					onRetry={handleRefresh}
					isRetrying={trends.isFetching}
				/>
			</WidgetCard>
		);
	}

	if (!trends.data || trends.data.length === 0) {
		return (
			<WidgetCard title="Response Trends">
				<WidgetEmpty
					title="No trend data"
					description="Response trends will appear once you have data"
				/>
			</WidgetCard>
		);
	}

	// Calculate total responses for comparison
	const totalResponses = trends.data.reduce((sum, d) => sum + d.responses, 0);
	const totalCompletions = trends.data.reduce(
		(sum, d) => sum + d.completions,
		0,
	);
	const completionRate =
		totalResponses > 0
			? Math.round((totalCompletions / totalResponses) * 100)
			: 0;

	// Transform data for chart
	const chartData = trends.data.map((d) => ({
		date: formatDate(d.date),
		responses: d.responses,
		completions: d.completions,
	}));

	return (
		<WidgetCard
			title="Response Trends"
			action={
				<WidgetRefreshButton
					onRefresh={handleRefresh}
					isRefreshing={trends.isFetching}
				/>
			}
		>
			<div className="space-y-4">
				{/* Summary stats */}
				<div className="flex items-center justify-between border-b pb-4">
					<div className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5 text-primary" />
						<div>
							<p className="font-medium text-sm">
								{totalResponses} total responses
							</p>
							<p className="text-muted-foreground text-xs">
								{completionRate}% completion rate
							</p>
						</div>
					</div>
				</div>

				{/* Chart */}
				<LineChart
					data={chartData}
					xKey="date"
					series={[
						{ key: "responses", name: "All Responses", color: "#3b82f6" },
						{ key: "completions", name: "Completions", color: "#10b981" },
					]}
					height={250}
					showGrid
					showDots
					showLegend
					formatter={(value) => `${value}`}
				/>
			</div>
		</WidgetCard>
	);
}
