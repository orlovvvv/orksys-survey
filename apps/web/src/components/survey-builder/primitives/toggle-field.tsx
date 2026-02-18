"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface ToggleFieldProps {
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
	label: string;
	description?: string;
	className?: string;
}

export function ToggleField({
	checked,
	onCheckedChange,
	label,
	description,
	className,
}: ToggleFieldProps) {
	return (
		<div className={cn("flex items-center justify-between", className)}>
			<div className="flex flex-col">
				<span className="font-semibold text-foreground text-sm">{label}</span>
				{description && (
					<span className="text-muted-foreground text-xs">{description}</span>
				)}
			</div>
			<Switch checked={checked} onCheckedChange={onCheckedChange} />
		</div>
	);
}
