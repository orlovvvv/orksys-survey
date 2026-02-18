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
					? "border border-primary/20 bg-primary/5 text-foreground"
					: "text-muted-foreground hover:bg-muted",
			)}
		>
			<div className="flex items-center gap-2">
				<div
					className={cn(
						"flex h-5 w-5 items-center justify-center rounded text-[10px]",
						isActive
							? "bg-primary text-white"
							: number === 1
								? "bg-success/10 text-success"
								: "bg-muted text-muted-foreground",
					)}
				>
					{number}
				</div>
				<span>{label}</span>
			</div>
			{isActive && <MoreHorizontal className="h-4 w-4 text-muted-foreground" />}
		</div>
	);
}
