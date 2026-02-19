"use client";

import { RefreshCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface WidgetRefreshButtonProps {
	onRefresh: () => void;
	isRefreshing: boolean;
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
}

export function WidgetRefreshButton({
	onRefresh,
	isRefreshing,
	size = "icon",
	className,
}: WidgetRefreshButtonProps) {
	return (
		<Button
			variant="ghost"
			size={size}
			onClick={onRefresh}
			disabled={isRefreshing}
			className={cn("text-muted-foreground", className)}
			aria-label="Refresh"
		>
			<RefreshCwIcon
				className={cn("h-4 w-4", isRefreshing && "animate-spin")}
			/>
		</Button>
	);
}
