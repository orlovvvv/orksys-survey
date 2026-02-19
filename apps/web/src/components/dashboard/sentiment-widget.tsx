"use client";

import { PieChart, PieChartLegend } from "@/components/charts/pie-chart";
import { useDashboardFilters } from "@/components/dashboard/providers";
import { useNPSQuery } from "@/components/dashboard/queries";
import {
	WidgetCard,
	WidgetEmpty,
	WidgetError,
	WidgetLoading,
	WidgetRefreshButton,
} from "@/components/dashboard/widgets/parts";

export function SentimentWidget() {
	const { filterParams } = useDashboardFilters();
	const {
		data: nps,
		isLoading,
		error,
		refetch,
		isFetching,
	} = useNPSQuery(filterParams);

	if (error) {
		return (
			<WidgetCard
				title="Response Sentiment"
				tooltip={{
					title: "Sentiment Analysis",
					description:
						"Categorization of responses based on customer sentiment.",
					calculation: "Based on NPS promoter/passive/detractor classification",
					dataPortrayal:
						"Positive: Promoters (9-10), Neutral: Passives (7-8), Negative: Detractors (0-6)",
				}}
				action={
					<WidgetRefreshButton
						onRefresh={() => refetch()}
						isRefreshing={isFetching}
					/>
				}
			>
				<WidgetError
					title="Sentiment Data Error"
					onRetry={() => refetch()}
					isRetrying={isFetching}
				/>
			</WidgetCard>
		);
	}

	if (isLoading) {
		return (
			<WidgetCard
				title="Response Sentiment"
				tooltip={{
					title: "Sentiment Analysis",
					description:
						"Categorization of responses based on customer sentiment.",
					calculation: "Based on NPS promoter/passive/detractor classification",
					dataPortrayal:
						"Positive: Promoters (9-10), Neutral: Passives (7-8), Negative: Detractors (0-6)",
				}}
			>
				<WidgetLoading type="gauge" height={200} />
			</WidgetCard>
		);
	}

	if (!nps || nps.totalResponses === 0) {
		return (
			<WidgetCard
				title="Response Sentiment"
				tooltip={{
					title: "Sentiment Analysis",
					description:
						"Categorization of responses based on customer sentiment.",
					calculation: "Based on NPS promoter/passive/detractor classification",
					dataPortrayal:
						"Positive: Promoters (9-10), Neutral: Passives (7-8), Negative: Detractors (0-6)",
				}}
			>
				<WidgetEmpty
					title="No sentiment data available"
					description="There are no NPS questions to analyze sentiment."
				/>
			</WidgetCard>
		);
	}

	// Use NPS distribution as a proxy for sentiment visualization
	const sentimentData = [
		{
			name: "Positive",
			value: nps.distribution.promoters,
			color: "hsl(var(--chart-1))",
		},
		{
			name: "Neutral",
			value: nps.distribution.passives,
			color: "hsl(var(--chart-2))",
		},
		{
			name: "Negative",
			value: nps.distribution.detractors,
			color: "hsl(var(--chart-5))",
		},
	];

	return (
		<WidgetCard
			title="Response Sentiment"
			tooltip={{
				title: "Sentiment Analysis",
				description: "Categorization of responses based on customer sentiment.",
				calculation: "Based on NPS promoter/passive/detractor classification",
				dataPortrayal:
					"Positive: Promoters (9-10), Neutral: Passives (7-8), Negative: Detractors (0-6)",
			}}
			action={
				<WidgetRefreshButton
					onRefresh={() => refetch()}
					isRefreshing={isFetching}
				/>
			}
		>
			<div className="flex flex-col items-center gap-4">
				<PieChart data={sentimentData} height={160} showLabels={false} />
				<PieChartLegend data={sentimentData} />
				<p className="text-center text-muted-foreground text-sm">
					{nps.totalResponses} responses analyzed
				</p>
			</div>
		</WidgetCard>
	);
}
