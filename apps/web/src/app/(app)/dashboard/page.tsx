import { auth } from "@orksys-survey/auth";
import { headers } from "next/headers";

import { authClient } from "@/lib/auth-client";

import Dashboard from "./dashboard";

export default async function DashboardPage() {
	// Middleware guarantees session exists at this point
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const customerState = await authClient.customer.state({
		fetchOptions: {
			headers: await headers(),
		},
	});

	// Session is guaranteed by middleware, but we handle the edge case gracefully
	if (!session) {
		return null;
	}

	return (
		<div className="mx-auto w-full max-w-7xl p-4 md:p-6">
			<Dashboard session={session} customerState={customerState} />
		</div>
	);
}
