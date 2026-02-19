"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCwIcon } from "lucide-react";
import { useState } from "react";
import {
	CohortPlaceholder,
	CSATCESWidget,
	EngagementWidget,
	FunnelWidget,
	HeatmapPlaceholder,
	NPSWidget,
	OverviewSection,
	SentimentWidget,
	SurveyFilter,
	TimeRangeToggle,
	TrendsChart,
} from "@/components/dashboard";
import { DashboardFiltersProvider } from "@/components/dashboard/providers";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { orpc } from "@/utils/orpc";

function DashboardContent({
	customerState,
}: {
	customerState: ReturnType<typeof authClient.customer.state>;
}) {
	const queryClient = useQueryClient();

	// Global refresh function
	const [isRefreshing, setIsRefreshing] = useState(false);

	const handleGlobalRefresh = async () => {
		setIsRefreshing(true);
		await queryClient.invalidateQueries({
			predicate: (query) => {
				const key = query.queryKey[0] as string;
				return typeof key === "string" && key.includes("dashboard.get");
			},
		});
		// Wait a bit for visual feedback
		setTimeout(() => setIsRefreshing(false), 500);
	};

	const hasProSubscription =
		(customerState?.activeSubscriptions?.length ?? 0) > 0;

	return (
		<div className="space-y-6">
			{/* Header with controls */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="font-bold text-2xl text-foreground">
						Analytics Dashboard
					</h2>
					<p className="text-muted-foreground text-sm">
						Overview of survey performance across your organization
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-3 sm:flex-nowrap sm:justify-end">
					<SurveyFilter />
					<TimeRangeToggle />
					<Button
						variant="outline"
						size="sm"
						onClick={handleGlobalRefresh}
						disabled={isRefreshing}
					>
						<RefreshCwIcon
							className={cn("h-4 w-4", isRefreshing && "animate-spin")}
						/>
					</Button>
				</div>
			</div>

			{/* Overview Cards */}
			<OverviewSection />

			{/* Main Metrics Grid */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
				<NPSWidget />
				<CSATCESWidget />
			</div>

			{/* Sentiment & Engagement */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
				<SentimentWidget />
				<EngagementWidget />
			</div>

			{/* Trends Chart - Full Width */}
			<TrendsChart />

			{/* Funnel & Placeholders */}
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				<FunnelWidget />
				<CohortPlaceholder />
				<HeatmapPlaceholder />
			</div>

			{/* Subscription CTA for free users */}
			{!hasProSubscription && (
				<div className="rounded-lg border border-muted bg-muted/50 p-6 text-center">
					<h3 className="mb-2 font-semibold text-foreground">
						Upgrade to Pro for Advanced Analytics
					</h3>
					<p className="mb-4 text-muted-foreground text-sm">
						Get access to cohort analysis, interaction heatmaps, and AI-powered
						insights.
					</p>
					<Button
						onClick={async () => await authClient.checkout({ slug: "pro" })}
					>
						Upgrade to Pro
					</Button>
				</div>
			)}
		</div>
	);
}

export default function Dashboard({
	customerState,
}: {
	customerState: ReturnType<typeof authClient.customer.state>;
	session: typeof authClient.$Infer.Session;
}) {
	// Fetch available surveys for the filter
	const { data: surveysData } = useQuery(
		orpc.survey.list.queryOptions({
			input: { page: 1, limit: 100 },
		}),
	);

	const availableSurveys =
		surveysData?.data.map((s) => ({
			id: s.id,
			title: s.title,
			slug: s.slug,
		})) ?? [];

	return (
		<DashboardFiltersProvider availableSurveys={availableSurveys}>
			<DashboardContent customerState={customerState} />
		</DashboardFiltersProvider>
	);
}
