"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import type { MemberRole } from "../types";

/**
 * Mutation to remove a member from the organization.
 * Invalidates org-scoped query key to ensure proper cache updates.
 */
export function useRemoveMember() {
	const queryClient = useQueryClient();
	const { data: session } = authClient.useSession();
	const orgId = session?.session?.activeOrganizationId;

	return useMutation({
		mutationFn: async ({ memberIdOrEmail }: { memberIdOrEmail: string }) => {
			const result = await authClient.organization.removeMember({
				memberIdOrEmail,
			});
			if (result.error) {
				throw new Error(result.error.message || "Failed to remove member");
			}
			return result.data;
		},
		onSuccess: () => {
			if (orgId) {
				queryClient.invalidateQueries({
					queryKey: ["organization", orgId, "members"],
				});
			}
			toast.success("Member removed successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to remove member");
		},
	});
}

/**
 * Mutation to update a member's role.
 * Invalidates org-scoped query key to ensure proper cache updates.
 */
export function useUpdateMemberRole() {
	const queryClient = useQueryClient();
	const { data: session } = authClient.useSession();
	const orgId = session?.session?.activeOrganizationId;

	return useMutation({
		mutationFn: async ({
			memberId,
			role,
		}: {
			memberId: string;
			role: MemberRole;
		}) => {
			const result = await authClient.organization.updateMemberRole({
				memberId,
				role,
			});
			if (result.error) {
				throw new Error(result.error.message || "Failed to update member role");
			}
			return result.data;
		},
		onSuccess: () => {
			if (orgId) {
				queryClient.invalidateQueries({
					queryKey: ["organization", orgId, "members"],
				});
			}
			toast.success("Member role updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update member role");
		},
	});
}
