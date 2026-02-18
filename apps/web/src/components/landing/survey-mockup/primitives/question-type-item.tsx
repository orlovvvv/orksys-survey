import type * as React from "react";

import { cn } from "@/lib/utils";

export interface QuestionTypeItemProps {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	isActive?: boolean;
}

export function QuestionTypeItem({
	icon: Icon,
	label,
	isActive = false,
}: QuestionTypeItemProps) {
	return (
		<div
			className={cn(
				"group flex cursor-move items-center gap-3 rounded-xl border p-3 transition-colors",
				isActive
					? "border-primary/20 bg-primary/5"
					: "border-transparent bg-white hover:border-neutral-200 hover:bg-neutral-50",
			)}
		>
			<Icon
				className={cn(
					"h-5 w-5 text-neutral-400 transition-colors",
					isActive && "group-hover:text-primary",
				)}
			/>
			<span className="font-medium text-neutral-700 text-sm">{label}</span>
		</div>
	);
}
