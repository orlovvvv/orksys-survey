"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

interface Session {
	id: string;
	token: string;
	userId: string;
	expiresAt: Date;
	ipAddress?: string;
	userAgent?: string;
	// ... other fields
}

/**
 * Fetches the list of active sessions for the current user.
 */
export function useSessions() {
	const query = useQuery({
		queryKey: ["account", "sessions"],
		queryFn: async () => {
			const response = await authClient.listSessions();
			return (response.data ?? []) as Session[];
		},
	});

	return {
		sessions: query.data ?? [],
		isLoading: query.isLoading,
		error: query.error ?? null,
		refetch: query.refetch,
	};
}

/**
 * Mutation to revoke a specific session.
 */
export function useRevokeSession() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ token }: { token: string }) => {
			await authClient.revokeSession({ token });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["account", "sessions"],
			});
			toast.success("Session revoked successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to revoke session");
		},
	});
}

/**
 * Mutation to revoke all other sessions (except the current one).
 */
export function useRevokeOtherSessions() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			await authClient.revokeOtherSessions();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["account", "sessions"],
			});
			toast.success("All other sessions revoked successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to revoke other sessions");
		},
	});
}
