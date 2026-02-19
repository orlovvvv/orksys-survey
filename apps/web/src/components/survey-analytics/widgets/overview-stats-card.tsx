"use client";

import type { SummaryAnalytics } from "@orksys-survey/db/schema/analytics";
import { Activity, Clock, FileText, PieChart } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { useSurveySummaryQuery } from "../queries";
import {
	formatDuration,
	formatNumber,
	formatPercentage,
} from "../utils/formatters";
import { WidgetEmpty, WidgetError, WidgetLoading } from "../widget-parts";

type StatType = "responses" | "completion" | "time" | "quality";

interface OverviewStatsCardProps {
	title: string;
	icon: React.ReactNode;
	type: StatType;
	tooltip?: { title: string; description: string };
}

// Stat card configuration
const statConfigs: Record<
	StatType,
	{
		title: string;
		icon: React.ReactNode;
		color: string;
		getValue: (data: SummaryAnalytics | undefined) => string | number;
		getDescription: (data: SummaryAnalytics | undefined) => string;
		tooltip: { title: string; description: string };
	}
> = {
	responses: {
		title: "Total Responses",
		icon: <FileText className="h-4 w-4" />,
		color: "text-primary",
		getValue: (data) => formatNumber(data?.totalResponses ?? 0),
		getDescription: (data) =>
			`${formatNumber(data?.completeResponses ?? 0)} complete, ${formatNumber(data?.partialResponses ?? 0)} partial`,
		tooltip: {
			title: "Total Responses",
			description:
				"The total number of people who started your survey, including both complete and partial responses.",
		},
	},
	completion: {
		title: "Completion Rate",
		icon: <PieChart className="h-4 w-4" />,
		color: "text-success",
		getValue: (data) => formatPercentage(data?.completionRate ?? 0),
		getDescription: () => "Percentage of completed surveys",
		tooltip: {
			title: "Completion Rate",
			description:
				"The percentage of respondents who completed the survey. Higher rates indicate better engagement.",
		},
	},
	time: {
		title: "Avg. Time",
		icon: <Clock className="h-4 w-4" />,
		color: "text-warning",
		getValue: (data) => formatDuration(data?.averageTimeSeconds ?? null),
		getDescription: () => "Average time to complete",
		tooltip: {
			title: "Average Completion Time",
			description:
				"The median time it takes for respondents to complete your survey.",
		},
	},
	quality: {
		title: "Response Quality",
		icon: <Activity className="h-4 w-4" />,
		color: "text-muted-foreground",
		getValue: (data) => {
			const rate = data?.completionRate ?? 0;
			return rate >= 80 ? "High" : rate >= 50 ? "Medium" : "Low";
		},
		getDescription: () => "Based on completion rate",
		tooltip: {
			title: "Response Quality",
			description:
				"Quality score based on completion rate. High quality (80%+) indicates respondents are engaged.",
		},
	},
};

export function OverviewStatsCard({
	title,
	icon,
	type,
	tooltip,
}: OverviewStatsCardProps) {
	const summary = useSurveySummaryQuery();

	if (summary.isLoading) {
		return (
			<Card>
				<CardContent className="flex h-[120px] items-center justify-center">
					<WidgetLoading type="stat" height={40} />
				</CardContent>
			</Card>
		);
	}

	if (summary.error) {
		return (
			<WidgetError
				title="Unable to load stats"
				onRetry={() => summary.refetch()}
				isRetrying={summary.isFetching}
			/>
		);
	}

	if (!summary.data) {
		return (
			<Card>
				<CardContent className="flex h-[120px] items-center justify-center">
					<WidgetEmpty title="No data" description="No responses yet" />
				</CardContent>
			</Card>
		);
	}

	const config = statConfigs[type];
	const value = config.getValue(summary.data);
	const description = config.getDescription(summary.data);
	const qualityColor =
		type === "quality"
			? (summary.data?.completionRate ?? 0) >= 80
				? "text-success"
				: (summary.data?.completionRate ?? 0) >= 50
					? "text-warning"
					: "text-destructive"
			: config.color;

	return (
		<Card>
			<CardContent className="p-6">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<p className="font-medium text-muted-foreground text-sm">
								{title}
							</p>
							{tooltip && (
								<div className="text-muted-foreground">
									<svg
										className="h-3 w-3"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										role="img"
										aria-label={tooltip.title}
									>
										<title>{tooltip.title}</title>
										<circle
											cx="12"
											cy="12"
											r="10"
											strokeWidth="2"
											strokeDasharray="3 3"
										/>
										<path
											strokeLinecap="round"
											strokeWidth="2"
											d="M12 16v-4M12 8h.01"
										/>
									</svg>
								</div>
							)}
						</div>
						<p
							className={cn(
								"font-bold text-2xl",
								type === "quality" && qualityColor,
							)}
						>
							{value}
						</p>
						<p className="text-muted-foreground text-xs">{description}</p>
					</div>
					<div className={cn("rounded-full bg-muted p-3", config.color)}>
						{icon}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

// Grid of all stat cards
export function OverviewStatsGrid() {
	return (
		<div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<OverviewStatsCard
				title="Total Responses"
				icon={<FileText className="h-4 w-4" />}
				type="responses"
				tooltip={statConfigs.responses.tooltip}
			/>
			<OverviewStatsCard
				title="Completion Rate"
				icon={<PieChart className="h-4 w-4" />}
				type="completion"
				tooltip={statConfigs.completion.tooltip}
			/>
			<OverviewStatsCard
				title="Avg. Time"
				icon={<Clock className="h-4 w-4" />}
				type="time"
				tooltip={statConfigs.time.tooltip}
			/>
			<OverviewStatsCard
				title="Response Quality"
				icon={<Activity className="h-4 w-4" />}
				type="quality"
				tooltip={statConfigs.quality.tooltip}
			/>
		</div>
	);
}
