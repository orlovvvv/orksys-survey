/**
 * Format duration in seconds to human readable string
 */
export function formatDuration(seconds: number | null): string {
	if (seconds === null) return "N/A";
	if (seconds < 60) return `${seconds}s`;
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	if (minutes < 60) {
		return remainingSeconds > 0
			? `${minutes}m ${remainingSeconds}s`
			: `${minutes}m`;
	}
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

/**
 * Format a number with commas
 */
export function formatNumber(value: number): string {
	return value.toLocaleString();
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals = 0): string {
	return `${value.toFixed(decimals)}%`;
}

/**
 * Format date to short string
 */
export function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});
}

/**
 * Get trend direction based on current vs previous value
 */
export function getTrendDirection(
	current: number,
	previous: number | undefined,
): "up" | "down" | "neutral" {
	if (previous === undefined) return "neutral";
	if (current > previous) return "up";
	if (current < previous) return "down";
	return "neutral";
}

/**
 * Get trend icon and color based on direction
 */
export function getTrendStyle(direction: "up" | "down" | "neutral"): {
	icon: string;
	color: string;
} {
	switch (direction) {
		case "up":
			return { icon: "↑", color: "text-success" };
		case "down":
			return { icon: "↓", color: "text-destructive" };
		default:
			return { icon: "−", color: "text-muted-foreground" };
	}
}
