import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/success", "/s"];
const authRoutes = [
	"/login",
	"/forgot-password",
	"/reset-password",
	"/verify-email",
];
const apiRoutes = ["/api"];

async function getSession(request: NextRequest) {
	try {
		const baseUrl = request.nextUrl.origin;
		const response = await fetch(`${baseUrl}/api/auth/get-session`, {
			headers: {
				cookie: request.headers.get("cookie") || "",
			},
		});

		if (!response.ok) return null;
		return await response.json();
	} catch (error) {
		console.error("Failed to fetch session in middleware:", error);
		return null;
	}
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Allow API routes
	if (apiRoutes.some((route) => pathname.startsWith(route))) {
		return NextResponse.next();
	}

	// Allow public routes (no auth check needed)
	if (
		publicRoutes.some(
			(route) => pathname === route || pathname.startsWith(`${route}/`),
		)
	) {
		return NextResponse.next();
	}

	// Auth routes - redirect authenticated users to dashboard
	if (authRoutes.some((route) => pathname === route)) {
		const session = await getSession(request);

		if (session?.user) {
			// User is authenticated, redirect to dashboard or onboarding
			if (session.session.activeOrganizationId) {
				return NextResponse.redirect(new URL("/dashboard", request.url));
			}
			return NextResponse.redirect(new URL("/onboarding", request.url));
		}

		// User is not authenticated, allow access to auth pages
		return NextResponse.next();
	}

	// Onboarding - requires authentication
	if (pathname === "/onboarding") {
		const session = await getSession(request);

		if (!session?.user) {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		if (session.session.activeOrganizationId) {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}

		return NextResponse.next();
	}

	// Protected routes - check authentication
	const session = await getSession(request);

	if (!session?.user) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Check for active organization
	if (!session.session.activeOrganizationId) {
		return NextResponse.redirect(new URL("/onboarding", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!_next/static|_next/image|favicon.ico).*)",
	],
};
