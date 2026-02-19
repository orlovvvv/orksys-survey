"use client";

import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";

import type { ReceivedInvitation } from "../types";

/**
 * Fetches the list of invitations the current user has received.
 * Uses Better Auth's listUserInvitations() to get pending invitations
 * for the authenticated user's email.
 */
export function useReceivedInvitations() {
	const { data: session } = authClient.useSession();
	const userEmail = session?.user?.email;

	const query = useQuery({
		queryKey: ["user", "received-invitations"],
		queryFn: async () => {
			const response = await authClient.organization.listUserInvitations();
			return (response.data ?? []) as ReceivedInvitation[];
		},
		enabled: !!userEmail,
	});

	return {
		receivedInvitations: query.data ?? [],
		isLoading: query.isLoading,
		error: query.error ?? null,
		refetch: query.refetch,
	};
}
