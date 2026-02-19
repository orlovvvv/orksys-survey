"use client";

import { AlertCircleIcon } from "lucide-react";
import { WidgetTooltip } from "@/components/dashboard/widget-tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function CohortPlaceholder() {
	return (
		<Card className="border-dashed">
			<CardHeader>
				<div className="flex items-center gap-2">
					<CardTitle className="text-muted-foreground">
						Cohort Analysis
					</CardTitle>
					<WidgetTooltip
						title="Cohort Analysis (Coming Soon)"
						description="Track retention and engagement of user groups over time."
						calculation="User cohorts by sign-up date with retention heatmap"
						dataPortrayal="Requires: User identification, session tracking infrastructure"
					/>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
						<AlertCircleIcon className="h-6 w-6" />
					</div>
					<h3 className="mb-2 font-semibold text-foreground">Coming Soon</h3>
					<p className="max-w-xs text-muted-foreground text-sm">
						Cohort analysis will show user retention patterns over time. This
						feature requires user identification and session tracking
						infrastructure.
					</p>
				</div>
				{/* Visual placeholder of the intended heatmap layout */}
				<div className="mt-6 grid grid-cols-12 gap-1 opacity-20">
					<div className="col-span-2 h-6 rounded-sm bg-muted" />
					{Array.from({ length: 10 }).map((_, i) => (
						<div key={i} className="h-6 rounded-sm bg-muted" />
					))}
					{Array.from({ length: 66 }).map((_, i) => (
						<div
							key={i}
							className={cn(
								"h-6 rounded-sm",
								i % 7 === 0 ? "bg-primary" : "bg-muted",
							)}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
