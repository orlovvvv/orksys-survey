"use client";

import { Laptop, Monitor, Smartphone, Tablet, Trash2 } from "lucide-react";
import type * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SessionItemProps {
	session: {
		id: string;
		token: string;
		expiresAt: Date;
		ipAddress?: string;
		userAgent?: string;
	};
	isCurrent: boolean;
	isRevoking?: boolean;
	onRevoke: (token: string) => void;
}

export function SessionItem({
	session,
	isCurrent,
	isRevoking = false,
	onRevoke,
}: SessionItemProps) {
	const deviceIcon = getDeviceIcon(session.userAgent);
	const deviceName = getDeviceName(session.userAgent);
	const location = getLocationFromIp(session.ipAddress);
	const lastActive = formatLastActive(session.expiresAt);

	return (
		<div className="border-b py-4 last:border-b-0">
			<div className="flex items-start justify-between">
				<div className="flex items-start gap-3">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
						{deviceIcon}
					</div>
					<div className="min-w-0 flex-1">
						<div className="mb-1 flex items-center gap-2">
							<span className="font-medium text-sm">{deviceName}</span>
							{isCurrent && (
								<Badge variant="secondary" className="text-xs">
									Current
								</Badge>
							)}
						</div>
						<div className="text-muted-foreground text-xs">
							{location && <span>{location}</span>}
							{location && session.ipAddress && <span> · </span>}
							{session.ipAddress && <span>{session.ipAddress}</span>}
						</div>
						<div className="mt-1 text-muted-foreground text-xs">
							{lastActive}
						</div>
					</div>
				</div>
				{!isCurrent && (
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={() => onRevoke(session.token)}
						disabled={isRevoking}
						className="text-muted-foreground hover:text-destructive"
					>
						{isRevoking ? (
							<span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
						) : (
							<Trash2 className="h-4 w-4" />
						)}
					</Button>
				)}
			</div>
		</div>
	);
}

// Helper functions
function getDeviceIcon(userAgent?: string): React.ReactNode {
	if (!userAgent) {
		return <Monitor className="h-5 w-5" />;
	}

	const ua = userAgent.toLowerCase();

	if (
		ua.includes("iphone") ||
		(ua.includes("android") && ua.includes("mobile"))
	) {
		return <Smartphone className="h-5 w-5" />;
	}
	if (
		ua.includes("ipad") ||
		ua.includes("tablet") ||
		(ua.includes("android") && !ua.includes("mobile"))
	) {
		return <Tablet className="h-5 w-5" />;
	}
	if (ua.includes("mac") || ua.includes("windows") || ua.includes("linux")) {
		return <Laptop className="h-5 w-5" />;
	}

	return <Monitor className="h-5 w-5" />;
}

function getDeviceName(userAgent?: string): string {
	if (!userAgent) {
		return "Unknown Device";
	}

	const ua = userAgent.toLowerCase();

	// Detect browser
	let browser = "Unknown Browser";
	if (ua.includes("chrome") && !ua.includes("edg")) {
		browser = "Chrome";
	} else if (ua.includes("safari") && !ua.includes("chrome")) {
		browser = "Safari";
	} else if (ua.includes("firefox")) {
		browser = "Firefox";
	} else if (ua.includes("edg")) {
		browser = "Edge";
	}

	// Detect OS
	let os = "Unknown OS";
	if (ua.includes("iphone")) {
		os = "iPhone";
	} else if (ua.includes("ipad")) {
		os = "iPad";
	} else if (ua.includes("mac")) {
		os = "macOS";
	} else if (ua.includes("android")) {
		os = "Android";
	} else if (ua.includes("windows")) {
		os = "Windows";
	} else if (ua.includes("linux")) {
		os = "Linux";
	}

	return `${browser} on ${os}`;
}

function getLocationFromIp(_ip?: string): string | null {
	// In a real implementation, you would use a geolocation service
	// For now, we'll return null
	return null;
}

function formatLastActive(expiresAt: Date): string {
	const now = new Date();
	const expires = new Date(expiresAt);
	const diffMs = expires.getTime() - now.getTime();
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffDays = Math.floor(diffHours / 24);

	if (diffDays > 0) {
		return `Expires in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
	}
	if (diffHours > 0) {
		return `Expires in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
	}
	const diffMinutes = Math.floor(diffMs / (1000 * 60));
	if (diffMinutes > 0) {
		return `Expires in ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
	}
	return "Expires soon";
}
