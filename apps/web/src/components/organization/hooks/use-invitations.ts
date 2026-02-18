"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import type { Invitation, MemberRole } from "../types";

/**
 * Fetches the list of invitations for the current organization.
 */
export function useInvitations() {
	const query = useQuery({
		queryKey: ["organization", "invitations"],
		queryFn: async () => {
			const response = await authClient.organization.listInvitations();
			return (response.data ?? []) as Invitation[];
		},
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
 */
export function useInviteMember() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			email,
			role,
		}: {
			email: string;
			role: MemberRole;
		}) => {
			await authClient.organization.inviteMember({
				email,
				role,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["organization", "invitations"],
			});
			toast.success("Invitation sent successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to send invitation");
		},
	});
}

/**
 * Mutation to cancel a pending invitation.
 */
export function useCancelInvitation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ invitationId }: { invitationId: string }) => {
			await authClient.organization.cancelInvitation({
				invitationId,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["organization", "invitations"],
			});
			toast.success("Invitation canceled successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to cancel invitation");
		},
	});
}
