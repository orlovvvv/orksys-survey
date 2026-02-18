"use client";

import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

interface StructureItemProps {
	number: number;
	label: string;
	isActive?: boolean;
	onClick: () => void;
	index: number;
}

export function StructureItem({
	number,
	label,
	isActive = false,
	onClick,
	index,
}: StructureItemProps) {
	return (
		<motion.button
			type="button"
			onClick={onClick}
			initial={{ opacity: 0, x: -10 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.2, delay: index * 0.03 }}
			className={cn(
				"flex w-full items-center justify-between rounded-xl p-2 font-medium text-sm transition-colors",
				isActive
					? "border border-primary/20 bg-primary/10 text-foreground"
					: "text-muted-foreground hover:bg-muted/50",
			)}
		>
			<div className="flex items-center gap-2">
				<div
					className={cn(
						"flex h-5 w-5 items-center justify-center rounded text-[10px] transition-colors",
						isActive
							? "bg-primary text-primary-foreground"
							: "bg-muted text-muted-foreground",
					)}
				>
					{number}
				</div>
				<span className="truncate">{label}</span>
			</div>
			{isActive && (
				<MoreHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
			)}
		</motion.button>
	);
}
