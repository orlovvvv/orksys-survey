"use client";

import {
	ArrowDownIcon,
	ArrowUpIcon,
	ClipboardListIcon,
	MinusIcon,
	TimerIcon,
	UserCheckIcon,
} from "lucide-react";
import { useDashboardFilters } from "@/components/dashboard/providers";
import { useSummaryQuery } from "@/components/dashboard/queries";
import { WidgetError } from "@/components/dashboard/widgets/parts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
	title: string;
	value: string | number;
	change?: number;
	trend?: "up" | "down" | "neutral";
	icon: React.ReactNode;
	loading?: boolean;
}

function StatCard({
	title,
	value,
	change,
	trend,
	icon,
	loading,
}: StatCardProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="font-medium text-muted-foreground text-sm">
					{title}
				</CardTitle>
				<div className="text-muted-foreground">{icon}</div>
			</CardHeader>
			<CardContent>
				{loading ? (
					<Skeleton className="h-8 w-24" />
				) : (
					<div className="font-bold text-2xl">{value}</div>
				)}
				{!loading && change !== undefined && (
					<p className="flex items-center text-muted-foreground text-xs">
						{trend === "up" && (
							<ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
						)}
						{trend === "down" && (
							<ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />
						)}
						{trend === "neutral" && (
							<MinusIcon className="mr-1 h-3 w-3 text-muted-foreground" />
						)}
						<span
							className={cn(
								"font-medium",
								trend === "up" && "text-green-500",
								trend === "down" && "text-red-500",
							)}
						>
							{change > 0 ? "+" : ""}
							{change}%
						</span>
						<span className="ml-1 text-muted-foreground">from last month</span>
					</p>
				)}
			</CardContent>
		</Card>
	);
}

export function OverviewWidget() {
	const { filterParams } = useDashboardFilters();
	const {
		data: summary,
		isLoading,
		error,
		refetch,
		isFetching,
	} = useSummaryQuery(filterParams);

	if (error) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card className="col-span-full">
					<CardContent className="flex items-center justify-center py-12">
						<WidgetError
							title="Dashboard Data Error"
							message="Unable to load overview statistics."
							onRetry={() => refetch()}
							isRetrying={isFetching}
						/>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!summary && !isLoading) {
		return null;
	}

	// Calculate month-over-month change
	const calculateChange = (current: number, previous: number) => {
		if (previous === 0) return 0;
		return Math.round(((current - previous) / previous) * 100);
	};

	const responseChange = summary
		? calculateChange(summary.totalResponses, summary.previousMonthResponses)
		: 0;

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<StatCard
				title="Total Surveys"
				value={summary?.totalSurveys ?? 0}
				icon={<ClipboardListIcon className="h-4 w-4" />}
				loading={isLoading}
			/>
			<StatCard
				title="Total Responses"
				value={summary?.totalResponses ?? 0}
				change={responseChange}
				trend={summary?.responseTrend}
				icon={<UserCheckIcon className="h-4 w-4" />}
				loading={isLoading}
			/>
			<StatCard
				title="Completion Rate"
				value={`${summary?.avgCompletionRate ?? 0}%`}
				icon={<MinusIcon className="h-4 w-4" />}
				loading={isLoading}
			/>
			<StatCard
				title="Active This Month"
				value={summary?.activeThisMonth ?? 0}
				icon={<TimerIcon className="h-4 w-4" />}
				loading={isLoading}
			/>
		</div>
	);
}

// Export as OverviewSection for backward compatibility
export { OverviewWidget as OverviewSection };
