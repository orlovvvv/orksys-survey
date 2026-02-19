/**
 * Generate a URL-safe slug from text
 * - Lowercase letters and numbers only
 * - Hyphens replace spaces and special characters
 * - Truncated to 50 characters max
 */
export function generateSlug(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "")
		.slice(0, 50);
}
