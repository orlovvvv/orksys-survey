"use client";

import type * as React from "react";
import {
	Bar,
	CartesianGrid,
	Cell,
	Line,
	Pie,
	BarChart as RechartsBarChart,
	LineChart as RechartsLineChart,
	PieChart as RechartsPieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { cn } from "@/lib/utils";

// Chart colors using CSS variables for theme consistency
export const CHART_COLORS = [
	"hsl(var(--chart-1))",
	"hsl(var(--chart-2))",
	"hsl(var(--chart-3))",
	"hsl(var(--chart-4))",
	"hsl(var(--chart-5))",
] as const;

// Chart context for shared configuration
interface ChartContextValue {
	colors: typeof CHART_COLORS;
	formatNumber: (value: number) => string;
	formatPercent: (value: number) => string;
	formatDate: (value: string) => string;
}

const defaultFormatters = {
	formatNumber: (value: number) => value.toLocaleString(),
	formatPercent: (value: number) => `${Math.round(value)}%`,
	formatDate: (value: string) => {
		const date = new Date(value);
		return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
	},
};

// Shared tooltip component
interface ChartTooltipProps {
	active?: boolean;
	payload?: Array<{
		name: string;
		value: number;
		color: string;
	}>;
	label?: string;
	formatter?: (value: number, name: string) => string;
}

export function ChartTooltip({
	active,
	payload,
	label,
	formatter,
}: ChartTooltipProps) {
	if (!active || !payload?.length) return null;

	return (
		<div className="rounded-lg border bg-background px-3 py-2 shadow-sm">
			{label && (
				<div className="mb-1 font-medium text-muted-foreground text-xs">
					{label}
				</div>
			)}
			{payload.map((entry, index) => (
				<div
					key={`${entry.name}-${index}`}
					className="flex items-center gap-2 text-sm"
				>
					<div
						className="h-2 w-2 rounded-full"
						style={{ backgroundColor: entry.color }}
					/>
					<span className="text-muted-foreground">{entry.name}:</span>
					<span className="font-medium">
						{formatter
							? formatter(entry.value, entry.name)
							: defaultFormatters.formatNumber(entry.value)}
					</span>
				</div>
			))}
		</div>
	);
}

// Empty state component
interface ChartEmptyProps {
	message?: string;
	className?: string;
}

export function ChartEmpty({
	message = "No data available",
	className,
}: ChartEmptyProps) {
	return (
		<div
			className={cn(
				"flex h-[200px] items-center justify-center text-muted-foreground text-sm",
				className,
			)}
		>
			{message}
		</div>
	);
}

// Export shared utilities
export const chartContext: ChartContextValue = {
	colors: CHART_COLORS,
	...defaultFormatters,
};
