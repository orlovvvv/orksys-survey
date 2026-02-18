"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import type { MemberRole } from "../types";

/**
 * Mutation to remove a member from the organization.
 */
export function useRemoveMember() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ memberIdOrEmail }: { memberIdOrEmail: string }) => {
			await authClient.organization.removeMember({
				memberIdOrEmail,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["organization", "members"] });
			toast.success("Member removed successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to remove member");
		},
	});
}

/**
 * Mutation to update a member's role.
 */
export function useUpdateMemberRole() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			memberId,
			role,
		}: {
			memberId: string;
			role: MemberRole;
		}) => {
			await authClient.organization.updateMemberRole({
				memberId,
				role,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["organization", "members"] });
			toast.success("Member role updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update member role");
		},
	});
}
