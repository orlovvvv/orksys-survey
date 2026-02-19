"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { FileText, FileX, Layers, Send } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export interface SurveysStatsProps {
	stats: {
		total: number;
		draft: number;
		published: number;
		closed: number;
		archived?: number;
	};
	isLoading?: boolean;
}

interface StatItemProps {
	label: string;
	value: number;
	icon: LucideIcon;
	index: number;
	isLoading?: boolean;
}

const staggerDelay = 0.05;

function StatItem({
	label,
	value,
	icon: Icon,
	index,
	isLoading,
}: StatItemProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2, delay: index * staggerDelay }}
			className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2"
		>
			<Icon className="h-4 w-4 text-muted-foreground" />
			<span className="text-muted-foreground text-sm">{label}</span>
			{isLoading ? (
				<Skeleton className="h-5 w-8" />
			) : (
				<span className="font-semibold tabular-nums">{value}</span>
			)}
		</motion.div>
	);
}

export function SurveysStats({ stats, isLoading }: SurveysStatsProps) {
	const statItems: Array<{
		label: string;
		value: number;
		icon: LucideIcon;
	}> = [
		{ label: "Total", value: stats.total, icon: FileText },
		{ label: "Draft", value: stats.draft, icon: FileX },
		{ label: "Published", value: stats.published, icon: Send },
		{ label: "Closed", value: stats.closed, icon: Layers },
	];

	return (
		<div className="flex flex-wrap gap-3">
			{statItems.map((stat, index) => (
				<StatItem
					key={stat.label}
					label={stat.label}
					value={stat.value}
					icon={stat.icon}
					index={index}
					isLoading={isLoading}
				/>
			))}
		</div>
	);
}
