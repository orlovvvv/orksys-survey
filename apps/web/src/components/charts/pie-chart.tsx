"use client";

import type * as React from "react";
import {
	Cell,
	Pie,
	PieChart as RechartsPieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";

import { cn } from "@/lib/utils";
import { CHART_COLORS, ChartEmpty, ChartTooltip } from "./chart-provider";

interface PieChartProps {
	data: Array<{
		name: string;
		value: number;
		color?: string;
	}>;
	height?: number;
	showLabels?: boolean;
	innerRadius?: number;
	outerRadius?: number;
	showLegend?: boolean;
	className?: string;
	formatter?: (value: number, name: string) => string;
}

export function PieChart({
	data,
	height = 300,
	showLabels = true,
	innerRadius = 0,
	outerRadius = 80,
	className,
	formatter,
}: PieChartProps) {
	if (!data || data.length === 0) {
		return <ChartEmpty />;
	}

	// Calculate total for percentage
	const total = data.reduce((sum, item) => sum + item.value, 0);

	return (
		<div className={cn("w-full", className)} style={{ height }}>
			<ResponsiveContainer width="100%" height="100%">
				<RechartsPieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						innerRadius={innerRadius}
						outerRadius={outerRadius}
						paddingAngle={2}
						dataKey="value"
						label={
							showLabels
								? ({ name, value }) => {
										const percent = Math.round((value / total) * 100);
										return percent >= 5 ? `${name}` : "";
									}
								: false
						}
						labelLine={showLabels}
					>
						{data.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]}
							/>
						))}
					</Pie>
					<Tooltip content={<ChartTooltip formatter={formatter} />} />
				</RechartsPieChart>
			</ResponsiveContainer>
		</div>
	);
}

// Donut chart variant
export function DonutChart(props: Omit<PieChartProps, "innerRadius">) {
	return <PieChart {...props} innerRadius={50} />;
}

// Legend component for pie charts
interface PieChartLegendProps {
	data: Array<{
		name: string;
		value: number;
		color?: string;
	}>;
	className?: string;
}

export function PieChartLegend({ data, className }: PieChartLegendProps) {
	const total = data.reduce((sum, item) => sum + item.value, 0);

	return (
		<div className={cn("flex flex-wrap gap-4", className)}>
			{data.map((entry, index) => (
				<div key={entry.name} className="flex items-center gap-2">
					<div
						className="h-3 w-3 rounded-full"
						style={{
							backgroundColor:
								entry.color || CHART_COLORS[index % CHART_COLORS.length],
						}}
					/>
					<span className="text-muted-foreground text-sm">{entry.name}</span>
					<span className="font-medium text-sm">
						{total > 0 ? Math.round((entry.value / total) * 100) : 0}%
					</span>
				</div>
			))}
		</div>
	);
}
