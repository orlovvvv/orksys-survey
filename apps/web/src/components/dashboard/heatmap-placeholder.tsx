"use client";

import { MousePointer2Icon } from "lucide-react";
import { WidgetTooltip } from "@/components/dashboard/widget-tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HeatmapPlaceholder() {
	return (
		<Card className="border-dashed">
			<CardHeader>
				<div className="flex items-center gap-2">
					<CardTitle className="text-muted-foreground">
						Interaction Heatmaps
					</CardTitle>
					<WidgetTooltip
						title="Interaction Heatmaps (Coming Soon)"
						description="Visual overlay showing user interaction patterns on survey pages."
						calculation="Click, scroll, and hover event aggregation"
						dataPortrayal="Requires: Event tracking infrastructure to be implemented"
					/>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
						<MousePointer2Icon className="h-6 w-6" />
					</div>
					<h3 className="mb-2 font-semibold text-foreground">Coming Soon</h3>
					<p className="max-w-xs text-muted-foreground text-sm">
						Heatmaps will show click, scroll, and hover patterns across your
						survey pages. This feature requires event tracking infrastructure.
					</p>
				</div>
				{/* Visual placeholder of the intended heatmap overlay */}
				<div className="relative mt-6 h-32 w-full overflow-hidden rounded-lg border bg-muted/20">
					<div className="absolute inset-0 bg-gradient-to-br from-transparent via-orange-500/10 to-transparent" />
					<div className="absolute top-1/4 left-1/4 h-8 w-8 rounded-full bg-red-500/20 blur-xl" />
					<div className="absolute top-1/3 left-1/2 h-12 w-12 rounded-full bg-orange-500/20 blur-xl" />
					<div className="absolute top-1/2 right-1/3 h-6 w-6 rounded-full bg-yellow-500/20 blur-xl" />
					<div className="absolute bottom-1/4 left-1/3 h-10 w-10 rounded-full bg-red-500/10 blur-xl" />
					{/* Mock form elements */}
					<div className="absolute top-4 right-4 left-4 space-y-2">
						<div className="h-2 w-1/3 rounded bg-foreground/10" />
						<div className="h-8 rounded border border-foreground/10 bg-background/50" />
						<div className="h-2 w-1/4 rounded bg-foreground/10" />
						<div className="h-8 rounded border border-foreground/10 bg-background/50" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
