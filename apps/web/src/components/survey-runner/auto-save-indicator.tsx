"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export interface AutoSaveIndicatorProps {
	isSaving: boolean;
	lastSavedAt: Date | null;
	error: string | null;
}

/**
 * Shows the current save status of survey progress.
 * Displays saving spinner, saved checkmark, or error state.
 */
export function AutoSaveIndicator({
	isSaving,
	lastSavedAt,
	error,
}: AutoSaveIndicatorProps) {
	if (error) {
		return (
			<div className="flex items-center gap-1.5 text-destructive text-sm">
				<XCircle className="h-4 w-4" />
				<span>Save failed</span>
			</div>
		);
	}

	if (isSaving) {
		return (
			<div className="flex items-center gap-1.5 text-muted-foreground text-sm">
				<Loader2 className="h-4 w-4 animate-spin" />
				<span>Saving...</span>
			</div>
		);
	}

	if (lastSavedAt) {
		const timeAgo = getTimeAgo(lastSavedAt);

		return (
			<div className="flex items-center gap-1.5 text-muted-foreground text-sm">
				<CheckCircle2 className="h-4 w-4 text-success" />
				<span>Saved {timeAgo}</span>
			</div>
		);
	}

	return null;
}

/**
 * Returns a human-readable time ago string.
 */
function getTimeAgo(date: Date): string {
	const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

	if (seconds < 60) {
		return "just now";
	}

	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) {
		return `${minutes}m ago`;
	}

	const hours = Math.floor(minutes / 60);
	if (hours < 24) {
		return `${hours}h ago`;
	}

	const days = Math.floor(hours / 24);
	return `${days}d ago`;
}
