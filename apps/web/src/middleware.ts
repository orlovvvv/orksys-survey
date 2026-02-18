import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/onboarding", "/success", "/s"];
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

	// Allow public routes
	if (
		publicRoutes.some(
			(route) => pathname === route || pathname.startsWith(route + "/"),
		)
	) {
		// For onboarding page, check if user already has active org
		if (pathname === "/onboarding") {
			const session = await getSession(request);

			if (!session?.user) {
				return NextResponse.redirect(new URL("/login", request.url));
			}

			if (session.session.activeOrganizationId) {
				return NextResponse.redirect(new URL("/dashboard", request.url));
			}
		}

		return NextResponse.next();
	}

	// Allow API routes
	if (apiRoutes.some((route) => pathname.startsWith(route))) {
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
