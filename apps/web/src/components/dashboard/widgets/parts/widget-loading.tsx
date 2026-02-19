"use client";

import { Skeleton } from "@/components/ui/skeleton";

export type WidgetLoadingType = "gauge" | "chart" | "list" | "funnel" | "stat";

export interface WidgetLoadingProps {
	type: WidgetLoadingType;
	height?: number;
}

export function WidgetLoading({ type, height = 200 }: WidgetLoadingProps) {
	return (
		<div className="flex items-center justify-center" style={{ height }}>
			{type === "gauge" && <Skeleton className="h-32 w-32 rounded-full" />}
			{type === "chart" && (
				<Skeleton className="h-full w-full" style={{ height }} />
			)}
			{type === "list" && (
				<div className="w-full space-y-3">
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
				</div>
			)}
			{type === "funnel" && (
				<div className="w-full space-y-4">
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
				</div>
			)}
			{type === "stat" && <Skeleton className="h-8 w-24" />}
		</div>
	);
}
