import { MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

export interface StructureItemProps {
	number: number;
	label: string;
	isActive?: boolean;
}

export function StructureItem({
	number,
	label,
	isActive = false,
}: StructureItemProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-between rounded-lg p-2 font-medium text-sm transition-colors",
				isActive
					? "border border-primary/20 bg-primary/5 text-neutral-900"
					: "text-neutral-600 hover:bg-neutral-50",
			)}
		>
			<div className="flex items-center gap-2">
				<div
					className={cn(
						"flex h-5 w-5 items-center justify-center rounded text-[10px]",
						isActive
							? "bg-primary text-white"
							: number === 1
								? "bg-green-100 text-green-600"
								: "bg-neutral-200 text-neutral-600",
					)}
				>
					{number}
				</div>
				<span>{label}</span>
			</div>
			{isActive && <MoreHorizontal className="h-4 w-4 text-neutral-400" />}
		</div>
	);
}
