"use client";

import * as React from "react";

/**
 * Generates a stable browser fingerprint using available browser APIs.
 * Combines multiple browser attributes to create a unique identifier.
 *
 * @returns A SHA-256 hash string representing the browser fingerprint, or null on server-side
 */
export function useFingerprint(): string | null {
	const [fingerprint, setFingerprint] = React.useState<string | null>(null);

	React.useEffect(() => {
		// Return null for server-side rendering
		if (typeof window === "undefined") {
			return;
		}

		// Collect browser attributes for fingerprinting
		const attributes = [
			navigator.userAgent,
			navigator.language,
			`${screen.width}x${screen.height}`,
			new Date().getTimezoneOffset().toString(),
		].join("|");

		// Generate SHA-256 hash
		async function generateHash() {
			try {
				const encoder = new TextEncoder();
				const data = encoder.encode(attributes);
				const hashBuffer = await crypto.subtle.digest("SHA-256", data);

				// Convert buffer to hex string
				const hashArray = Array.from(new Uint8Array(hashBuffer));
				const hashHex = hashArray
					.map((b) => b.toString(16).padStart(2, "0"))
					.join("");

				setFingerprint(hashHex);
			} catch {
				// Fallback to simple hash if crypto.subtle fails
				const simpleHash = simpleHashString(attributes);
				setFingerprint(simpleHash);
			}
		}

		generateHash();
	}, []);

	return fingerprint;
}

/**
 * Simple fallback hash function for environments where crypto.subtle is unavailable.
 * Uses a basic DJB2-style hash algorithm.
 */
function simpleHashString(str: string): string {
	let hash = 5381;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) + hash + str.charCodeAt(i); // hash * 33 + c
	}
	return (hash >>> 0).toString(16); // Convert to unsigned and hex
}
