"use client";

import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export interface WidgetErrorProps {
	title: string;
	message?: string;
	onRetry: () => void;
	isRetrying?: boolean;
}

export function WidgetError({
	title,
	message = "Unable to load data. Please try again.",
	onRetry,
	isRetrying = false,
}: WidgetErrorProps) {
	return (
		<Alert variant="destructive" className="border-dashed">
			<AlertCircleIcon className="h-4 w-4" />
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription className="flex items-center justify-between gap-4">
				<span className="text-muted-foreground text-sm">{message}</span>
				<Button
					variant="outline"
					size="sm"
					onClick={onRetry}
					disabled={isRetrying}
					className="shrink-0"
				>
					<RefreshCwIcon
						className={`h-3 w-3 ${isRetrying ? "animate-spin" : ""}`}
					/>
					Try again
				</Button>
			</AlertDescription>
		</Alert>
	);
}
