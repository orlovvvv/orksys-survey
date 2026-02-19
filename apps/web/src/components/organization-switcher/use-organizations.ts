"use client";

import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";

export interface Organization {
	id: string;
	name: string;
	slug: string;
}

interface UseOrganizationsOptions {
	enabled?: boolean;
	session?: { user?: unknown } | null;
}

export function useOrganizations({
	enabled = true,
	session,
}: UseOrganizationsOptions = {}) {
	const query = useQuery({
		queryKey: ["organizations"],
		queryFn: async () => {
			const result = await authClient.organization.list();
			return (result.data ?? []) as Organization[];
		},
		enabled: enabled && !!session?.user,
	});

	return {
		organizations: query.data ?? [],
		isPending: query.isLoading,
		refetch: query.refetch,
	};
}
