"use client";

import { ClockIcon, PercentIcon } from "lucide-react";
import { useDashboardFilters } from "@/components/dashboard/providers";
import {
	useFunnelQuery,
	useSummaryQuery,
} from "@/components/dashboard/queries";
import {
	WidgetCard,
	WidgetEmpty,
	WidgetError,
	WidgetLoading,
	WidgetRefreshButton,
} from "@/components/dashboard/widgets/parts";

interface MetricProps {
	label: string;
	value: string;
	icon: React.ReactNode;
}

function Metric({ label, value, icon }: MetricProps) {
	return (
		<div className="flex items-center gap-3">
			<div className="text-muted-foreground">{icon}</div>
			<div>
				<p className="font-semibold text-foreground text-lg">{value}</p>
				<p className="text-muted-foreground text-xs">{label}</p>
			</div>
		</div>
	);
}

export function EngagementWidget() {
	const { filterParams } = useDashboardFilters();
	const summary = useSummaryQuery(filterParams);
	const funnel = useFunnelQuery(filterParams);

	const isLoading = summary.isLoading || funnel.isLoading;
	const error = summary.error || funnel.error;
	const isFetching = summary.isFetching || funnel.isFetching;

	const handleRefresh = () => {
		summary.refetch();
		funnel.refetch();
	};

	if (error) {
		return (
			<WidgetCard
				title="Response Engagement"
				tooltip={{
					title: "Response Engagement",
					description: "How users interact with your surveys.",
					calculation: "Response Rate: Complete / Started × 100",
					dataPortrayal: "Measures completion rates and engagement quality",
				}}
				action={
					<WidgetRefreshButton
						onRefresh={handleRefresh}
						isRefreshing={isFetching}
					/>
				}
			>
				<WidgetError
					title="Engagement Data Error"
					message="Unable to load engagement data."
					onRetry={handleRefresh}
					isRetrying={isFetching}
				/>
			</WidgetCard>
		);
	}

	if (isLoading) {
		return (
			<WidgetCard
				title="Response Engagement"
				tooltip={{
					title: "Response Engagement",
					description: "How users interact with your surveys.",
					calculation: "Response Rate: Complete / Started × 100",
					dataPortrayal: "Measures completion rates and engagement quality",
				}}
			>
				<div className="space-y-4">
					<WidgetLoading type="list" />
				</div>
			</WidgetCard>
		);
	}

	const summaryData = summary.data;
	const funnelData = funnel.data;

	if (!summaryData && !funnelData) {
		return (
			<WidgetCard
				title="Response Engagement"
				tooltip={{
					title: "Response Engagement",
					description: "How users interact with your surveys.",
					calculation: "Response Rate: Complete / Started × 100",
					dataPortrayal: "Measures completion rates and engagement quality",
				}}
			>
				<WidgetEmpty
					title="No engagement data available"
					description="There are no survey responses yet."
				/>
			</WidgetCard>
		);
	}

	// Calculate engagement metrics
	const responseRate = funnelData
		? funnelData.started > 0
			? Math.round((funnelData.complete / funnelData.started) * 100)
			: 0
		: 0;

	const avgTime = summaryData?.avgCompletionRate
		? "2:30" // Placeholder - would come from actual data
		: "--:--";

	return (
		<WidgetCard
			title="Response Engagement"
			tooltip={{
				title: "Response Engagement",
				description: "How users interact with your surveys.",
				calculation: "Response Rate: Complete / Started × 100",
				dataPortrayal: "Measures completion rates and engagement quality",
			}}
			action={
				<WidgetRefreshButton
					onRefresh={handleRefresh}
					isRefreshing={isFetching}
				/>
			}
		>
			<div className="space-y-4">
				<Metric
					label="Response Rate"
					value={`${responseRate}%`}
					icon={<PercentIcon className="h-5 w-5" />}
				/>
				<Metric
					label="Avg. Time to Complete"
					value={avgTime}
					icon={<ClockIcon className="h-5 w-5" />}
				/>
				{summaryData && summaryData.totalResponses > 0 && (
					<p className="pt-2 text-center text-muted-foreground text-sm">
						{summaryData.totalResponses.toLocaleString()} total responses
					</p>
				)}
			</div>
		</WidgetCard>
	);
}
