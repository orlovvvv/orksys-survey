"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";

interface NpsGaugeProps {
	score: number;
	className?: string;
	showLabel?: boolean;
	size?: "sm" | "md" | "lg";
}

const sizeConfig = {
	sm: { radius: 40, strokeWidth: 8, fontSize: "text-2xl" },
	md: { radius: 60, strokeWidth: 10, fontSize: "text-3xl" },
	lg: { radius: 80, strokeWidth: 12, fontSize: "text-4xl" },
};

export function NpsGauge({
	score,
	className,
	showLabel = true,
	size = "md",
}: NpsGaugeProps) {
	const { radius, strokeWidth, fontSize } = sizeConfig[size];

	// NPS ranges from -100 to 100
	// Convert to 0-100 scale for display
	const normalizedScore = Math.max(-100, Math.min(100, score));
	const percentage = ((normalizedScore + 100) / 200) * 100;

	// Determine color based on NPS score
	const getColor = (nps: number) => {
		if (nps >= 50) return "hsl(var(--chart-1))"; // Green - Excellent
		if (nps >= 0) return "hsl(var(--chart-2))"; // Yellow - Good
		return "hsl(var(--chart-5))"; // Red - Needs improvement
	};

	const getLabel = (nps: number) => {
		if (nps >= 50) return "Excellent";
		if (nps >= 0) return "Good";
		return "Needs Work";
	};

	const color = getColor(normalizedScore);
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - (percentage / 100) * circumference;

	return (
		<div className={cn("flex flex-col items-center gap-2", className)}>
			<div className="relative">
				<svg
					width={radius * 2 + strokeWidth}
					height={radius * 2 + strokeWidth}
					className="-rotate-90 transform"
				>
					{/* Background circle */}
					<circle
						cx={radius + strokeWidth / 2}
						cy={radius + strokeWidth / 2}
						r={radius}
						fill="none"
						stroke="hsl(var(--muted))"
						strokeWidth={strokeWidth}
					/>
					{/* Progress circle */}
					<circle
						cx={radius + strokeWidth / 2}
						cy={radius + strokeWidth / 2}
						r={radius}
						fill="none"
						stroke={color}
						strokeWidth={strokeWidth}
						strokeDasharray={circumference}
						strokeDashoffset={strokeDashoffset}
						strokeLinecap="round"
						className="transition-all duration-500"
					/>
				</svg>
				<div
					className={cn(
						"absolute inset-0 flex flex-col items-center justify-center",
						fontSize,
					)}
				>
					<span className="font-bold">{normalizedScore}</span>
				</div>
			</div>
			{showLabel && (
				<span className="font-medium text-muted-foreground text-sm">
					{getLabel(normalizedScore)}
				</span>
			)}
		</div>
	);
}

// Rating display component (1-5 or 1-10 scales)
interface RatingDisplayProps {
	value: number;
	max?: number;
	className?: string;
	showValue?: boolean;
}

export function RatingDisplay({
	value,
	max = 5,
	className,
	showValue = true,
}: RatingDisplayProps) {
	const percentage = (value / max) * 100;

	return (
		<div className={cn("flex items-center gap-3", className)}>
			<div className="flex-1">
				<div className="h-2 w-full rounded-full bg-muted">
					<div
						className="h-full rounded-full bg-primary transition-all duration-300"
						style={{ width: `${percentage}%` }}
					/>
				</div>
			</div>
			{showValue && (
				<span className="font-medium text-sm tabular-nums">
					{value.toFixed(1)}/{max}
				</span>
			)}
		</div>
	);
}
