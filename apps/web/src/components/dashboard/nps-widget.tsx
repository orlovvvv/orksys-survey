"use client";

import { BarChart } from "@/components/charts/bar-chart";
import { NpsGauge } from "@/components/charts/nps-gauge";
import { useDashboardFilters } from "@/components/dashboard/providers";
import { useNPSQuery } from "@/components/dashboard/queries";
import {
	WidgetCard,
	WidgetEmpty,
	WidgetError,
	WidgetLoading,
	WidgetRefreshButton,
} from "@/components/dashboard/widgets/parts";

export function NPSWidget() {
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
				title="Net Promoter Score"
				tooltip={{
					title: "Net Promoter Score (NPS)",
					description: "Measures customer loyalty and satisfaction.",
					calculation: "% Promoters (9-10) - % Detractors (0-6)",
					dataPortrayal:
						"Range: -100 to +100. Excellent: ≥50, Good: 0-49, Needs Work: <0",
				}}
				action={
					<WidgetRefreshButton
						onRefresh={() => refetch()}
						isRefreshing={isFetching}
					/>
				}
			>
				<WidgetError
					title="NPS Data Error"
					onRetry={() => refetch()}
					isRetrying={isFetching}
				/>
			</WidgetCard>
		);
	}

	if (isLoading) {
		return (
			<WidgetCard
				title="Net Promoter Score"
				tooltip={{
					title: "Net Promoter Score (NPS)",
					description: "Measures customer loyalty and satisfaction.",
					calculation: "% Promoters (9-10) - % Detractors (0-6)",
					dataPortrayal:
						"Range: -100 to +100. Excellent: ≥50, Good: 0-49, Needs Work: <0",
				}}
			>
				<WidgetLoading type="gauge" height={180} />
			</WidgetCard>
		);
	}

	if (!nps || nps.totalResponses === 0) {
		return (
			<WidgetCard
				title="Net Promoter Score"
				tooltip={{
					title: "Net Promoter Score (NPS)",
					description: "Measures customer loyalty and satisfaction.",
					calculation: "% Promoters (9-10) - % Detractors (0-6)",
					dataPortrayal:
						"Range: -100 to +100. Excellent: ≥50, Good: 0-49, Needs Work: <0",
				}}
			>
				<WidgetEmpty
					title="No NPS data available"
					description="There are no NPS questions in your surveys yet."
				/>
			</WidgetCard>
		);
	}

	const distributionData = [
		{
			name: "Promoters",
			value: nps.distribution.promoters,
			color: "hsl(var(--chart-1))",
		},
		{
			name: "Passives",
			value: nps.distribution.passives,
			color: "hsl(var(--chart-2))",
		},
		{
			name: "Detractors",
			value: nps.distribution.detractors,
			color: "hsl(var(--chart-5))",
		},
	];

	return (
		<WidgetCard
			title="Net Promoter Score"
			tooltip={{
				title: "Net Promoter Score (NPS)",
				description: "Measures customer loyalty and satisfaction.",
				calculation: "% Promoters (9-10) - % Detractors (0-6)",
				dataPortrayal:
					"Range: -100 to +100. Excellent: ≥50, Good: 0-49, Needs Work: <0",
			}}
			action={
				<WidgetRefreshButton
					onRefresh={() => refetch()}
					isRefreshing={isFetching}
				/>
			}
		>
			<div className="flex flex-col items-center gap-6">
				<NpsGauge score={nps.score} size="lg" />
				<div className="w-full">
					<BarChart data={distributionData} height={120} showGrid={false} />
				</div>
				<p className="text-center text-muted-foreground text-sm">
					{nps.totalResponses} responses across all NPS questions
				</p>
			</div>
		</WidgetCard>
	);
}
