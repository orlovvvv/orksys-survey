"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import type { MemberRole } from "../types";

interface TransferOwnershipParams {
	newOwnerMemberId: string;
	previousOwnerMemberId: string;
	previousOwnerNewRole?: Extract<MemberRole, "admin" | "member">;
}

interface TransferOwnershipOptions {
	onSuccess?: () => void;
}

/**
 * Mutation to transfer organization ownership to another member.
 *
 * This performs two sequential role updates:
 * 1. Promote the new owner to "owner" role
 * 2. Demote the previous owner to their new role (default: "admin")
 *
 * Handles partial failure scenarios gracefully.
 */
export function useTransferOwnership(options?: TransferOwnershipOptions) {
	const queryClient = useQueryClient();
	const { data: session } = authClient.useSession();
	const orgId = session?.session?.activeOrganizationId;

	return useMutation({
		mutationFn: async (params: TransferOwnershipParams) => {
			const {
				newOwnerMemberId,
				previousOwnerMemberId,
				previousOwnerNewRole = "admin",
			} = params;

			// Step 1: Promote new owner
			const promoteResult = await authClient.organization.updateMemberRole({
				memberId: newOwnerMemberId,
				role: "owner",
			});

			if (promoteResult.error) {
				throw new Error(
					promoteResult.error.message || "Failed to promote new owner",
				);
			}

			// Step 2: Demote previous owner
			const demoteResult = await authClient.organization.updateMemberRole({
				memberId: previousOwnerMemberId,
				role: previousOwnerNewRole,
			});

			if (demoteResult.error) {
				// Partial failure: new owner was promoted but previous owner demotion failed
				// This results in co-ownership, which is recoverable
				toast.warning(
					"Ownership transferred, but your role update failed. The organization now has two owners.",
				);
				return { success: true, partialFailure: true };
			}

			return { success: true, partialFailure: false };
		},
		onSuccess: (result) => {
			if (orgId) {
				queryClient.invalidateQueries({
					queryKey: ["organization", orgId, "members"],
				});
			}

			if (!result.partialFailure) {
				toast.success("Ownership transferred successfully");
			}

			options?.onSuccess?.();
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to transfer ownership");
		},
	});
}
