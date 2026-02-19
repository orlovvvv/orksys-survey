"use client";

import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";

import type { Member } from "../types";

export interface UseOrganizationMembersResult {
	members: Member[];
	isLoading: boolean;
	error: Error | null;
	refetch: () => void;
}

/**
 * Fetches the list of members for the current organization.
 * Query key includes org ID to ensure proper reactivity when switching organizations.
 */
export function useOrganizationMembers(): UseOrganizationMembersResult {
	const { data: session } = authClient.useSession();
	const orgId = session?.session?.activeOrganizationId;

	const query = useQuery({
		queryKey: ["organization", orgId, "members"],
		queryFn: async () => {
			const response = await authClient.organization.listMembers();
			return (response.data?.members ?? []) as Member[];
		},
		enabled: !!orgId,
	});

	return {
		members: query.data ?? [],
		isLoading: query.isLoading,
		error: query.error ?? null,
		refetch: query.refetch,
	};
}
