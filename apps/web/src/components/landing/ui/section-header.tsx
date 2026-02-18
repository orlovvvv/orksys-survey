import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionHeaderProps {
	label?: string;
	title: ReactNode;
	description?: ReactNode;
	action?: ReactNode;
	align?: "left" | "center";
	className?: string;
}

export function SectionHeader({
	label,
	title,
	description,
	action,
	align = "left",
	className,
}: SectionHeaderProps) {
	return (
		<div className={cn("mb-12 flex w-full flex-col", className)}>
			{label && (
				<div className="flex w-full items-center justify-between pb-5">
					<div className="flex items-center gap-2">
						<span className="h-px w-8 bg-primary" />
						<span className="font-bold font-sans text-primary text-xs uppercase tracking-[0.2em]">
							{label}
						</span>
					</div>
					{action && <div className="ml-auto">{action}</div>}
				</div>
			)}

			<div className="mb-8 h-px w-full bg-border" />

			<div
				className={cn(
					"flex flex-col justify-between gap-8 lg:flex-row lg:items-start lg:gap-16",
					align === "center" && "text-center",
				)}
			>
				<h2
					className={cn(
						"max-w-3xl font-display font-normal text-3xl text-foreground leading-[1.05] tracking-tight md:text-4xl lg:text-5xl",
						align === "center" && "mx-auto",
					)}
				>
					{title}
				</h2>
				{description && (
					<div
						className={cn(
							"flex-shrink-0 lg:max-w-sm lg:pt-2",
							align === "center" && "mx-auto lg:max-w-md",
						)}
					>
						<p className="font-sans text-base text-muted-foreground leading-relaxed">
							{description}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
