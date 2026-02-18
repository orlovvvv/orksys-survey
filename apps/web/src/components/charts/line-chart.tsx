"use client";

import type * as React from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart as RechartsLineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { cn } from "@/lib/utils";
import { CHART_COLORS, ChartEmpty, ChartTooltip } from "./chart-provider";

interface LineChartProps {
	data: Array<Record<string, unknown>>;
	xKey: string;
	series: Array<{
		key: string;
		name: string;
		color?: string;
	}>;
	height?: number;
	showGrid?: boolean;
	showDots?: boolean;
	showLegend?: boolean;
	className?: string;
	formatter?: (value: number, name: string) => string;
}

export function LineChart({
	data,
	xKey,
	series,
	height = 300,
	showGrid = true,
	showDots = true,
	showLegend = false,
	className,
	formatter,
}: LineChartProps) {
	if (!data || data.length === 0) {
		return <ChartEmpty />;
	}

	return (
		<div className={cn("w-full", className)} style={{ height }}>
			<ResponsiveContainer width="100%" height="100%">
				<RechartsLineChart
					data={data}
					margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
				>
					{showGrid && (
						<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
					)}
					<XAxis
						dataKey={xKey}
						tickLine={false}
						axisLine={false}
						tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
						interval="preserveStartEnd"
					/>
					<YAxis
						tickLine={false}
						axisLine={false}
						tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
					/>
					<Tooltip content={<ChartTooltip formatter={formatter} />} />
					{showLegend && (
						<Legend
							verticalAlign="top"
							height={36}
							formatter={(value) => (
								<span className="text-muted-foreground text-sm">{value}</span>
							)}
						/>
					)}
					{series.map((s, index) => (
						<Line
							key={s.key}
							type="monotone"
							dataKey={s.key}
							name={s.name}
							stroke={s.color || CHART_COLORS[index % CHART_COLORS.length]}
							strokeWidth={2}
							dot={showDots ? { r: 3 } : false}
							activeDot={{ r: 5 }}
						/>
					))}
				</RechartsLineChart>
			</ResponsiveContainer>
		</div>
	);
}
