"use client";

import { TrendingDown } from "lucide-react";

import { BarChart } from "@/components/charts/bar-chart";
import { useSurveySummaryQuery } from "../queries";
import { formatNumber, formatPercentage } from "../utils/formatters";
import {
	WidgetCard,
	WidgetEmpty,
	WidgetError,
	WidgetLoading,
	WidgetRefreshButton,
} from "../widget-parts";

interface FunnelStep {
	name: string;
	value: number;
	percentage: number;
	color: string;
}

export function ResponseFunnelWidget() {
	const summary = useSurveySummaryQuery();

	const handleRefresh = () => {
		summary.refetch();
	};

	if (summary.isLoading) {
		return (
			<WidgetCard title="Response Funnel">
				<WidgetLoading type="funnel" height={200} />
			</WidgetCard>
		);
	}

	if (summary.error) {
		return (
			<WidgetCard title="Response Funnel">
				<WidgetError
					title="Unable to load funnel data"
					onRetry={handleRefresh}
					isRetrying={summary.isFetching}
				/>
			</WidgetCard>
		);
	}

	if (!summary.data) {
		return (
			<WidgetCard title="Response Funnel">
				<WidgetEmpty
					title="No funnel data"
					description="Funnel data will appear once you have responses"
				/>
			</WidgetCard>
		);
	}

	const { totalResponses, completeResponses, partialResponses } = summary.data;

	// Calculate funnel steps
	// Assuming views = totalResponses * 1.5 (estimate - not tracked)
	// In a real implementation, you'd track actual page views
	const estimatedViews = Math.max(
		totalResponses,
		Math.round(totalResponses * 1.2),
	);

	const funnelData: FunnelStep[] = [
		{
			name: "Views",
			value: estimatedViews,
			percentage: 100,
			color: "#94a3b8",
		},
		{
			name: "Started",
			value: totalResponses,
			percentage:
				estimatedViews > 0
					? Math.round((totalResponses / estimatedViews) * 100)
					: 0,
			color: "#3b82f6",
		},
		{
			name: "Complete",
			value: completeResponses,
			percentage:
				totalResponses > 0
					? Math.round((completeResponses / totalResponses) * 100)
					: 0,
			color: "#10b981",
		},
		{
			name: "Partial",
			value: partialResponses,
			percentage:
				totalResponses > 0
					? Math.round((partialResponses / totalResponses) * 100)
					: 0,
			color: "#f59e0b",
		},
	].filter((step) => step.value > 0);

	// Transform for bar chart (horizontal)
	const chartData = funnelData.reverse().map((step) => ({
		name: step.name,
		value: step.value,
		color: step.color,
	}));

	return (
		<WidgetCard
			title="Response Funnel"
			action={
				<WidgetRefreshButton
					onRefresh={handleRefresh}
					isRefreshing={summary.isFetching}
				/>
			}
		>
			<div className="space-y-4">
				{/* Summary */}
				<div className="flex items-center gap-2 border-b pb-4">
					<TrendingDown className="h-5 w-5 text-primary" />
					<p className="text-muted-foreground text-sm">
						<span className="font-medium text-foreground">
							{formatPercentage(
								(completeResponses / totalResponses) * 100 || 0,
							)}
						</span>{" "}
						of those who started completed the survey
					</p>
				</div>

				{/* Funnel chart */}
				<BarChart
					data={chartData}
					height={chartData.length * 50 + 20}
					horizontal
					showGrid={false}
					formatter={(value) => {
						const startedValue = chartData.find(
							(d) => d.name === "Started",
						)?.value;
						const percentage = startedValue ? (value / startedValue) * 100 : 0;
						return `${formatNumber(value)} (${formatNumber(percentage)}%)`;
					}}
				/>

				{/* Legend */}
				<div className="flex flex-wrap gap-4 pt-2">
					{funnelData.map((step) => (
						<div key={step.name} className="flex items-center gap-2">
							<div
								className="h-3 w-3 rounded-full"
								style={{ backgroundColor: step.color }}
							/>
							<span className="text-muted-foreground text-xs">
								{step.name}: {formatNumber(step.value)}
							</span>
						</div>
					))}
				</div>
			</div>
		</WidgetCard>
	);
}
