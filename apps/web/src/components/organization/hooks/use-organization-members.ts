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
 */
export function useOrganizationMembers(): UseOrganizationMembersResult {
	const query = useQuery({
		queryKey: ["organization", "members"],
		queryFn: async () => {
			const response = await authClient.organization.listMembers();
			return (response.data?.members ?? []) as Member[];
		},
	});

	return {
		members: query.data ?? [],
		isLoading: query.isLoading,
		error: query.error ?? null,
		refetch: query.refetch,
	};
}
