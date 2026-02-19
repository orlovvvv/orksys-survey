"use client";

import type { TimeRange } from "@/components/dashboard/providers";
import { useDashboardFilters } from "@/components/dashboard/providers";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const TIME_RANGES = [
	{ value: "7d" as const, label: "7d" },
	{ value: "30d" as const, label: "30d" },
	{ value: "90d" as const, label: "90d" },
	{ value: "all" as const, label: "All" },
];

export function TimeRangeToggle({ className }: { className?: string }) {
	const { timeRange, setTimeRange } = useDashboardFilters();

	return (
		<div className={cn("flex items-center gap-2", className)}>
			{/* Mobile: Select */}
			<div className="@[767px]/card:hidden">
				<Select
					value={timeRange}
					onValueChange={(value) => {
						setTimeRange(value as TimeRange);
					}}
				>
					<SelectTrigger size="sm" className="w-20">
						{TIME_RANGES.find((r) => r.value === timeRange)?.label ?? "30d"}
					</SelectTrigger>
					<SelectContent>
						{TIME_RANGES.map((range) => (
							<SelectItem key={range.value} value={range.value}>
								{range.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Desktop: Button group instead of ToggleGroup */}
			<div className="@[767px]/card:block hidden">
				<div className="inline-flex items-center rounded-lg bg-muted p-1">
					{TIME_RANGES.map((range) => (
						<button
							key={range.value}
							type="button"
							onClick={() => setTimeRange(range.value)}
							className={cn(
								"inline-flex min-w-12 items-center justify-center rounded-md px-3 py-1 font-medium text-sm transition-colors",
								timeRange === range.value
									? "bg-background text-foreground shadow-sm"
									: "text-muted-foreground hover:bg-background/50 hover:text-foreground",
							)}
						>
							{range.label}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
