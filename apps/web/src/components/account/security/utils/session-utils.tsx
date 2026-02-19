import { Laptop, Monitor, Smartphone, Tablet } from "lucide-react";
import type * as React from "react";

export interface DeviceInfo {
	name: string;
	icon: React.ReactNode;
}

/**
 * Detect device type and name from user agent string
 */
export function detectDevice(userAgent?: string): DeviceInfo {
	if (!userAgent) {
		return {
			name: "Unknown Device",
			icon: <Monitor className="h-5 w-5" />,
		};
	}

	const ua = userAgent.toLowerCase();

	// Detect icon
	if (
		ua.includes("iphone") ||
		(ua.includes("android") && ua.includes("mobile"))
	) {
		return {
			name: getDeviceName(userAgent),
			icon: <Smartphone className="h-5 w-5" />,
		};
	}
	if (
		ua.includes("ipad") ||
		ua.includes("tablet") ||
		(ua.includes("android") && !ua.includes("mobile"))
	) {
		return {
			name: getDeviceName(userAgent),
			icon: <Tablet className="h-5 w-5" />,
		};
	}
	if (ua.includes("mac") || ua.includes("windows") || ua.includes("linux")) {
		return {
			name: getDeviceName(userAgent),
			icon: <Laptop className="h-5 w-5" />,
		};
	}

	return {
		name: getDeviceName(userAgent),
		icon: <Monitor className="h-5 w-5" />,
	};
}

/**
 * Format IP address, hiding localhost/unknown addresses
 */
export function formatIpAddress(ip?: string): string | null {
	if (!ip) return null;

	// Skip localhost/unknown IPs
	if (
		ip === "::" ||
		ip === "0000:0000:0000:0000:0000:0000:0000:0000" ||
		ip === "::1" ||
		ip === "127.0.0.1"
	) {
		return null;
	}

	// Compress IPv6 notation
	if (ip.includes(":")) {
		// Simple compression for IPv6
		return ip
			.replace(/(^|:)0{1,4}/g, "$1")
			.replace(/:{3,}/, "::")
			.replace(/:{2}/g, "::");
	}

	return ip;
}

/**
 * Format session expiration time
 */
export function formatSessionTime(expiresAt: Date): string {
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

function getDeviceName(userAgent: string): string {
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
