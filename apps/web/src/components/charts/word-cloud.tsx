"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";
import { CHART_COLORS } from "./chart-provider";

interface WordCloudProps {
	keywords: Array<{
		word: string;
		count: number;
		weight: number;
	}>;
	className?: string;
	maxWords?: number;
}

export function WordCloud({
	keywords,
	className,
	maxWords = 20,
}: WordCloudProps) {
	if (!keywords || keywords.length === 0) {
		return (
			<div className="flex h-[200px] items-center justify-center text-muted-foreground text-sm">
				No keywords to display
			</div>
		);
	}

	// Take top N keywords
	const displayKeywords = keywords.slice(0, maxWords);

	// Calculate font sizes based on weight
	const minSize = 14;
	const maxSize = 36;

	return (
		<div
			className={cn(
				"flex flex-wrap items-center justify-center gap-3 p-4",
				className,
			)}
		>
			{displayKeywords.map((keyword, index) => {
				const fontSize = minSize + (maxSize - minSize) * keyword.weight;
				const color = CHART_COLORS[index % CHART_COLORS.length];

				return (
					<span
						key={`${keyword.word}-${index}`}
						className="cursor-default transition-transform hover:scale-110"
						style={{
							fontSize: `${fontSize}px`,
							color,
							fontWeight:
								keyword.weight > 0.7 ? 600 : keyword.weight > 0.4 ? 500 : 400,
						}}
						title={`${keyword.word}: ${keyword.count} mentions`}
					>
						{keyword.word}
					</span>
				);
			})}
		</div>
	);
}

// List view for keywords
interface KeywordListProps {
	keywords: Array<{
		word: string;
		count: number;
		weight: number;
	}>;
	className?: string;
	maxItems?: number;
}

export function KeywordList({
	keywords,
	className,
	maxItems = 10,
}: KeywordListProps) {
	if (!keywords || keywords.length === 0) {
		return (
			<div className="flex h-[100px] items-center justify-center text-muted-foreground text-sm">
				No keywords to display
			</div>
		);
	}

	const displayKeywords = keywords.slice(0, maxItems);

	return (
		<div className={cn("space-y-2", className)}>
			{displayKeywords.map((keyword, index) => (
				<div
					key={`${keyword.word}-${index}`}
					className="flex items-center gap-3"
				>
					<div className="w-24">
						<span className="font-medium text-sm">{keyword.word}</span>
					</div>
					<div className="flex-1">
						<div className="h-2 w-full rounded-full bg-muted">
							<div
								className="h-full rounded-full transition-all duration-300"
								style={{
									width: `${keyword.weight * 100}%`,
									backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
								}}
							/>
						</div>
					</div>
					<span className="w-12 text-right font-medium text-muted-foreground text-sm tabular-nums">
						{keyword.count}
					</span>
				</div>
			))}
		</div>
	);
}
