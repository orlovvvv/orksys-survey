"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

/**
 * Mutations for responding to organization invitations.
 * Provides accept and reject functionality with proper cache invalidation
 * and toast notifications.
 */
export function useRespondToInvitation() {
	const queryClient = useQueryClient();

	const acceptInvitation = useMutation({
		mutationFn: async ({ invitationId }: { invitationId: string }) => {
			const result = await authClient.organization.acceptInvitation({
				invitationId,
			});
			if (result.error) {
				throw new Error(result.error.message || "Failed to accept invitation");
			}
			return result.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["user", "received-invitations"],
			});
			// Invalidate organization list since user joined a new org
			queryClient.invalidateQueries({
				queryKey: ["organizations"],
			});
			toast.success("Invitation accepted");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to accept invitation");
		},
	});

	const rejectInvitation = useMutation({
		mutationFn: async ({ invitationId }: { invitationId: string }) => {
			const result = await authClient.organization.rejectInvitation({
				invitationId,
			});
			if (result.error) {
				throw new Error(result.error.message || "Failed to decline invitation");
			}
			return result.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["user", "received-invitations"],
			});
			toast.success("Invitation declined");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to decline invitation");
		},
	});

	return {
		acceptInvitation,
		rejectInvitation,
		isAccepting: acceptInvitation.isPending,
		isRejecting: rejectInvitation.isPending,
	};
}
