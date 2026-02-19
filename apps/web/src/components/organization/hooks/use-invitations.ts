"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import type { Invitation, MemberRole } from "../types";

/**
 * Fetches the list of invitations for the current organization.
 * Query key includes org ID to ensure proper reactivity when switching organizations.
 */
export function useInvitations() {
	const { data: session } = authClient.useSession();
	const orgId = session?.session?.activeOrganizationId;

	const query = useQuery({
		queryKey: ["organization", orgId, "invitations"],
		queryFn: async () => {
			const response = await authClient.organization.listInvitations();
			return (response.data ?? []) as Invitation[];
		},
		enabled: !!orgId,
	});

	return {
		invitations: query.data ?? [],
		isLoading: query.isLoading,
		error: query.error ?? null,
		refetch: query.refetch,
	};
}

/**
 * Mutation to invite a new member to the organization.
 * Invalidates org-scoped query key to ensure proper cache updates.
 */
export function useInviteMember() {
	const queryClient = useQueryClient();
	const { data: session } = authClient.useSession();
	const orgId = session?.session?.activeOrganizationId;

	return useMutation({
		mutationFn: async ({
			email,
			role,
		}: {
			email: string;
			role: MemberRole;
		}) => {
			const result = await authClient.organization.inviteMember({
				email,
				role,
			});
			if (result.error) {
				throw new Error(result.error.message || "Failed to send invitation");
			}
			return result.data;
		},
		onSuccess: () => {
			if (orgId) {
				queryClient.invalidateQueries({
					queryKey: ["organization", orgId, "invitations"],
				});
			}
			toast.success("Invitation sent successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to send invitation");
		},
	});
}

/**
 * Mutation to cancel a pending invitation.
 * Invalidates org-scoped query key to ensure proper cache updates.
 */
export function useCancelInvitation() {
	const queryClient = useQueryClient();
	const { data: session } = authClient.useSession();
	const orgId = session?.session?.activeOrganizationId;

	return useMutation({
		mutationFn: async ({ invitationId }: { invitationId: string }) => {
			const result = await authClient.organization.cancelInvitation({
				invitationId,
			});
			if (result.error) {
				throw new Error(result.error.message || "Failed to cancel invitation");
			}
			return result.data;
		},
		onSuccess: () => {
			if (orgId) {
				queryClient.invalidateQueries({
					queryKey: ["organization", orgId, "invitations"],
				});
			}
			toast.success("Invitation canceled successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to cancel invitation");
		},
	});
}
