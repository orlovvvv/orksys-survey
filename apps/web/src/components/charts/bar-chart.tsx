"use client";

import {
	Bar,
	CartesianGrid,
	Cell,
	BarChart as RechartsBarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { cn } from "@/lib/utils";
import { CHART_COLORS, ChartEmpty, ChartTooltip } from "./chart-provider";

interface BarChartProps {
	data: Array<{
		name: string;
		value: number;
		color?: string;
	}>;
	height?: number;
	showGrid?: boolean;
	showLabels?: boolean;
	horizontal?: boolean;
	className?: string;
	formatter?: (value: number, name: string) => string;
}

export function BarChart({
	data,
	height = 300,
	showGrid = true,
	showLabels = true,
	horizontal = false,
	className,
	formatter,
}: BarChartProps) {
	if (!data || data.length === 0) {
		return <ChartEmpty />;
	}

	const maxBarSize = 60;

	if (horizontal) {
		return (
			<div className={cn("w-full", className)} style={{ height }}>
				<ResponsiveContainer width="100%" height="100%">
					<RechartsBarChart
						data={data}
						layout="vertical"
						margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
					>
						{showGrid && (
							<CartesianGrid
								strokeDasharray="3 3"
								className="stroke-muted"
								horizontal={false}
							/>
						)}
						<XAxis
							type="number"
							tickLine={false}
							axisLine={false}
							tick={{ fill: "currentColor", fontSize: 12 }}
							className="text-muted-foreground"
						/>
						<YAxis
							dataKey="name"
							type="category"
							tickLine={false}
							axisLine={false}
							tick={{ fill: "currentColor", fontSize: 12 }}
							className="text-muted-foreground"
							width={100}
							interval={0}
						/>
						<Tooltip content={<ChartTooltip formatter={formatter} />} />
						<Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={maxBarSize}>
							{data.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={
										entry.color || CHART_COLORS[index % CHART_COLORS.length]
									}
								/>
							))}
						</Bar>
					</RechartsBarChart>
				</ResponsiveContainer>
			</div>
		);
	}

	return (
		<div className={cn("w-full", className)} style={{ height }}>
			<ResponsiveContainer width="100%" height="100%">
				<RechartsBarChart
					data={data}
					margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
				>
					{showGrid && (
						<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
					)}
					<XAxis
						dataKey="name"
						tickLine={false}
						axisLine={false}
						tick={{ fill: "currentColor", fontSize: 12 }}
						className="text-muted-foreground"
						interval="preserveStartEnd"
					/>
					<YAxis
						tickLine={false}
						axisLine={false}
						tick={{ fill: "currentColor", fontSize: 12 }}
						className="text-muted-foreground"
					/>
					<Tooltip content={<ChartTooltip formatter={formatter} />} />
					<Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={maxBarSize}>
						{data.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]}
							/>
						))}
					</Bar>
				</RechartsBarChart>
			</ResponsiveContainer>
		</div>
	);
}
