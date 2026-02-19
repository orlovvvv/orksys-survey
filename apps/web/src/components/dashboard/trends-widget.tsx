"use client";

import { LineChart } from "@/components/charts/line-chart";
import { useDashboardFilters } from "@/components/dashboard/providers";
import { useTrendsQuery } from "@/components/dashboard/queries";
import {
	WidgetCard,
	WidgetEmpty,
	WidgetError,
	WidgetLoading,
	WidgetRefreshButton,
} from "@/components/dashboard/widgets/parts";

export function TrendsWidget() {
	const { filterParams } = useDashboardFilters();
	const {
		data: trends,
		isLoading,
		error,
		refetch,
		isFetching,
	} = useTrendsQuery(filterParams);

	if (error) {
		return (
			<WidgetCard
				title="Response Trends"
				tooltip={{
					title: "Response Trends",
					description: "Survey response activity over time.",
					calculation: "Daily count of all responses and completed responses",
					dataPortrayal:
						"Aggregated from all surveys in the selected time range",
				}}
				action={
					<WidgetRefreshButton
						onRefresh={() => refetch()}
						isRefreshing={isFetching}
					/>
				}
				fullWidth
			>
				<WidgetError
					title="Trends Data Error"
					onRetry={() => refetch()}
					isRetrying={isFetching}
				/>
			</WidgetCard>
		);
	}

	if (isLoading) {
		return (
			<WidgetCard
				title="Response Trends"
				tooltip={{
					title: "Response Trends",
					description: "Survey response activity over time.",
					calculation: "Daily count of all responses and completed responses",
					dataPortrayal:
						"Aggregated from all surveys in the selected time range",
				}}
				fullWidth
			>
				<WidgetLoading type="chart" height={200} />
			</WidgetCard>
		);
	}

	const chartData = trends ?? [];

	if (chartData.length === 0) {
		return (
			<WidgetCard
				title="Response Trends"
				tooltip={{
					title: "Response Trends",
					description: "Survey response activity over time.",
					calculation: "Daily count of all responses and completed responses",
					dataPortrayal:
						"Aggregated from all surveys in the selected time range",
				}}
				fullWidth
			>
				<WidgetEmpty
					title="No trend data available"
					description="There are no responses in the selected time range."
				/>
			</WidgetCard>
		);
	}

	const series = [
		{
			key: "responses",
			name: "Total Responses",
			color: "hsl(var(--chart-1))",
		},
		{
			key: "complete",
			name: "Complete",
			color: "hsl(var(--chart-2))",
		},
	];

	return (
		<WidgetCard
			title="Response Trends"
			tooltip={{
				title: "Response Trends",
				description: "Survey response activity over time.",
				calculation: "Daily count of all responses and completed responses",
				dataPortrayal: "Aggregated from all surveys in the selected time range",
			}}
			action={
				<WidgetRefreshButton
					onRefresh={() => refetch()}
					isRefreshing={isFetching}
				/>
			}
			fullWidth
		>
			<LineChart
				data={chartData}
				xKey="date"
				series={series}
				height={200}
				showDots={false}
				showLegend
			/>
		</WidgetCard>
	);
}

// Export as TrendsChart for backward compatibility
export { TrendsWidget as TrendsChart };
