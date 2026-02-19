"use client";

import { BarChart } from "@/components/charts/bar-chart";
import { useDashboardFilters } from "@/components/dashboard/providers";
import { useRatingsQuery } from "@/components/dashboard/queries";
import {
	WidgetCard,
	WidgetEmpty,
	WidgetError,
	WidgetLoading,
	WidgetRefreshButton,
} from "@/components/dashboard/widgets/parts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CSATCESWidget() {
	const { filterParams } = useDashboardFilters();
	const {
		data: ratings,
		isLoading,
		error,
		refetch,
		isFetching,
	} = useRatingsQuery(filterParams);

	if (error) {
		return (
			<WidgetCard
				title="Customer Ratings"
				tooltip={{
					title: "CSAT & CES Ratings",
					description:
						"Average ratings from customer satisfaction and effort score questions.",
					calculation: "Average of all numeric rating responses",
					dataPortrayal:
						"Higher scores indicate better satisfaction (CSAT) or lower effort (CES).",
				}}
				action={
					<WidgetRefreshButton
						onRefresh={() => refetch()}
						isRefreshing={isFetching}
					/>
				}
			>
				<WidgetError
					title="Ratings Data Error"
					onRetry={() => refetch()}
					isRetrying={isFetching}
				/>
			</WidgetCard>
		);
	}

	if (isLoading) {
		return (
			<WidgetCard
				title="Customer Ratings"
				tooltip={{
					title: "CSAT & CES Ratings",
					description:
						"Average ratings from customer satisfaction and effort score questions.",
					calculation: "Average of all numeric rating responses",
					dataPortrayal:
						"Higher scores indicate better satisfaction (CSAT) or lower effort (CES).",
				}}
			>
				<WidgetLoading type="chart" height={200} />
			</WidgetCard>
		);
	}

	const ratingData = ratings?.rating ?? [];

	if (ratingData.length === 0) {
		return (
			<WidgetCard
				title="Customer Ratings"
				tooltip={{
					title: "CSAT & CES Ratings",
					description:
						"Average ratings from customer satisfaction and effort score questions.",
					calculation: "Average of all numeric rating responses",
					dataPortrayal:
						"Higher scores indicate better satisfaction (CSAT) or lower effort (CES).",
				}}
			>
				<WidgetEmpty
					title="No rating data available"
					description="There are no rating questions in your surveys yet."
				/>
			</WidgetCard>
		);
	}

	const chartData = ratingData.map((r) => ({
		name:
			r.questionTitle.length > 20
				? `${r.questionTitle.slice(0, 20)}...`
				: r.questionTitle,
		value: r.average,
		color: undefined,
	}));

	return (
		<WidgetCard
			title="Customer Ratings"
			tooltip={{
				title: "CSAT & CES Ratings",
				description:
					"Average ratings from customer satisfaction and effort score questions.",
				calculation: "Average of all numeric rating responses",
				dataPortrayal:
					"Higher scores indicate better satisfaction (CSAT) or lower effort (CES).",
			}}
			action={
				<WidgetRefreshButton
					onRefresh={() => refetch()}
					isRefreshing={isFetching}
				/>
			}
		>
			<Tabs defaultValue="all">
				<TabsList className="mb-4">
					<TabsTrigger value="all">All</TabsTrigger>
				</TabsList>
				<TabsContent value="all" className="mt-0">
					<BarChart
						data={chartData}
						height={200}
						horizontal
						showGrid={false}
						showLabels={false}
						formatter={(value) => value.toFixed(1)}
					/>
					<p className="mt-4 text-center text-muted-foreground text-sm">
						{ratingData.length} rating questions across all surveys
					</p>
				</TabsContent>
			</Tabs>
		</WidgetCard>
	);
}
