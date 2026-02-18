"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedTabButtonProps {
	active: boolean;
	icon: LucideIcon;
	onClick: () => void;
	children: React.ReactNode;
	layoutId?: string;
	className?: string;
}

export function AnimatedTabButton({
	active,
	icon: Icon,
	onClick,
	children,
	layoutId = "activeTab",
	className,
}: AnimatedTabButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"relative flex items-center gap-2 rounded-md px-4 py-1.5 font-sans font-semibold text-xs transition-colors",
				active
					? "text-foreground"
					: "text-muted-foreground hover:text-foreground",
				className,
			)}
		>
			{active && (
				<motion.div
					layoutId={layoutId}
					className="absolute inset-0 rounded-md bg-card shadow-sm"
					transition={{ type: "spring", stiffness: 500, damping: 30 }}
				/>
			)}
			<span className="relative z-10 flex items-center gap-2">
				<Icon className="h-3.5 w-3.5" />
				{children}
			</span>
		</button>
	);
}
