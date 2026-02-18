"use client";

import { Clock, FileText, PieChart, Users } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SummaryAnalytics {
	totalResponses: number;
	completeResponses: number;
	partialResponses: number;
	completionRate: number;
	averageTimeSeconds: number | null;
}

interface AnalyticsOverviewProps {
	summary: SummaryAnalytics | undefined;
	isLoading: boolean;
}

function formatDuration(seconds: number | null): string {
	if (seconds === null) return "N/A";
	if (seconds < 60) return `${seconds}s`;
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	if (minutes < 60) {
		return remainingSeconds > 0
			? `${minutes}m ${remainingSeconds}s`
			: `${minutes}m`;
	}
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export function AnalyticsOverview({
	summary,
	isLoading,
}: AnalyticsOverviewProps) {
	if (isLoading) {
		return (
			<div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-4" />
						</CardHeader>
						<CardContent>
							<Skeleton className="mb-1 h-8 w-16" />
							<Skeleton className="h-3 w-32" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	const stats = [
		{
			title: "Total Responses",
			value: summary?.totalResponses ?? 0,
			description: `${summary?.completeResponses ?? 0} complete, ${summary?.partialResponses ?? 0} partial`,
			icon: FileText,
			color: "text-blue-500",
		},
		{
			title: "Completion Rate",
			value: `${summary?.completionRate ?? 0}%`,
			description: "Percentage of completed surveys",
			icon: PieChart,
			color: "text-green-500",
		},
		{
			title: "Avg. Completion Time",
			value: formatDuration(summary?.averageTimeSeconds ?? null),
			description: "Average time to complete",
			icon: Clock,
			color: "text-orange-500",
		},
		{
			title: "Response Quality",
			value:
				(summary?.completionRate ?? 0) >= 80
					? "High"
					: (summary?.completionRate ?? 0) >= 50
						? "Medium"
						: "Low",
			description: "Based on completion rate",
			icon: Users,
			color:
				(summary?.completionRate ?? 0) >= 80
					? "text-green-500"
					: (summary?.completionRate ?? 0) >= 50
						? "text-yellow-500"
						: "text-red-500",
		},
	];

	return (
		<div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{stats.map((stat) => (
				<Card key={stat.title}>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardDescription className="font-medium text-sm">
							{stat.title}
						</CardDescription>
						<stat.icon className={`h-4 w-4 ${stat.color}`} />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{stat.value}</div>
						<p className="text-muted-foreground text-xs">{stat.description}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
