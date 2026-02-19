"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

const ONLY_OWNER_ERROR = "YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER";

/**
 * Mutation to leave the current organization.
 * Invalidates org lists and redirects to settings on success.
 */
export function useLeaveOrganization() {
	const queryClient = useQueryClient();
	const router = useRouter();
	const { data: session } = authClient.useSession();
	const orgId = session?.session?.activeOrganizationId;

	return useMutation({
		mutationFn: async ({ organizationId }: { organizationId: string }) => {
			const result = await authClient.organization.leave({ organizationId });
			if (result.error) {
				throw new Error(result.error.message || "Failed to leave organization");
			}
			return result.data;
		},
		onSuccess: () => {
			// Invalidate org-related queries
			queryClient.invalidateQueries({ queryKey: ["organizations"] });
			if (orgId) {
				queryClient.invalidateQueries({
					queryKey: ["organization", orgId],
				});
			}
			toast.success("You have left the organization");
			// Redirect to organization settings
			router.push("/settings/organization");
		},
		onError: (error: Error) => {
			const message = error.message;
			if (message.includes(ONLY_OWNER_ERROR)) {
				toast.error(
					"You cannot leave as the only owner. Transfer ownership to another member first.",
				);
			} else {
				toast.error(message || "Failed to leave organization");
			}
		},
	});
}
