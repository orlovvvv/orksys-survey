"use client";

import { useDashboardFilters } from "@/components/dashboard/providers";
import { useFunnelQuery } from "@/components/dashboard/queries";
import {
	WidgetCard,
	WidgetEmpty,
	WidgetError,
	WidgetLoading,
	WidgetRefreshButton,
} from "@/components/dashboard/widgets/parts";
import { cn } from "@/lib/utils";

interface FunnelStageProps {
	label: string;
	value: number;
	percentage: number;
	color: string;
	isLast?: boolean;
}

function FunnelStage({
	label,
	value,
	percentage,
	color,
	isLast,
}: FunnelStageProps) {
	const maxWidth = 100;
	const stageWidth = isLast ? maxWidth : percentage;

	return (
		<div className="space-y-1">
			<div className="flex items-center justify-between text-sm">
				<span className="text-muted-foreground">{label}</span>
				<span className="font-medium">{value.toLocaleString()}</span>
			</div>
			<div className="relative h-8 w-full overflow-hidden rounded-md bg-muted">
				<div
					className={cn(
						"absolute top-0 left-0 flex h-full items-center justify-end pr-3 font-medium text-white text-xs transition-all duration-500",
						color,
					)}
					style={{ width: `${stageWidth}%` }}
				>
					{!isLast && `${percentage}%`}
				</div>
			</div>
		</div>
	);
}

export function FunnelWidget() {
	const { filterParams } = useDashboardFilters();
	const {
		data: funnel,
		isLoading,
		error,
		refetch,
		isFetching,
	} = useFunnelQuery(filterParams);

	if (error) {
		return (
			<WidgetCard
				title="Survey Funnel"
				tooltip={{
					title: "Survey Funnel",
					description: "Conversion through survey completion stages.",
					calculation: "Views → Started → Partial → Complete",
					dataPortrayal: "Shows drop-off rates at each stage of the survey",
				}}
				action={
					<WidgetRefreshButton
						onRefresh={() => refetch()}
						isRefreshing={isFetching}
					/>
				}
			>
				<WidgetError
					title="Funnel Data Error"
					onRetry={() => refetch()}
					isRetrying={isFetching}
				/>
			</WidgetCard>
		);
	}

	if (isLoading) {
		return (
			<WidgetCard
				title="Survey Funnel"
				tooltip={{
					title: "Survey Funnel",
					description: "Conversion through survey completion stages.",
					calculation: "Views → Started → Partial → Complete",
					dataPortrayal: "Shows drop-off rates at each stage of the survey",
				}}
			>
				<WidgetLoading type="funnel" />
			</WidgetCard>
		);
	}

	if (!funnel || funnel.views === 0) {
		return (
			<WidgetCard
				title="Survey Funnel"
				tooltip={{
					title: "Survey Funnel",
					description: "Conversion through survey completion stages.",
					calculation: "Views → Started → Partial → Complete",
					dataPortrayal: "Shows drop-off rates at each stage of the survey",
				}}
			>
				<WidgetEmpty
					title="No funnel data available"
					description="There are no survey responses yet."
				/>
			</WidgetCard>
		);
	}

	return (
		<WidgetCard
			title="Survey Funnel"
			tooltip={{
				title: "Survey Funnel",
				description: "Conversion through survey completion stages.",
				calculation: "Views → Started → Partial → Complete",
				dataPortrayal: "Shows drop-off rates at each stage of the survey",
			}}
			action={
				<WidgetRefreshButton
					onRefresh={() => refetch()}
					isRefreshing={isFetching}
				/>
			}
		>
			<div className="space-y-4">
				<FunnelStage
					label="Views"
					value={funnel.views}
					percentage={100}
					color="bg-blue-500"
				/>
				<FunnelStage
					label="Started"
					value={funnel.started}
					percentage={funnel.viewToStarted}
					color="bg-indigo-500"
				/>
				<FunnelStage
					label="Partial"
					value={funnel.partial}
					percentage={
						funnel.started > 0
							? Math.round((funnel.partial / funnel.started) * 100)
							: 0
					}
					color="bg-amber-500"
				/>
				<FunnelStage
					label="Complete"
					value={funnel.complete}
					percentage={funnel.startedToComplete}
					color="bg-green-500"
					isLast
				/>
			</div>
		</WidgetCard>
	);
}
