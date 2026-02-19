"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

/**
 * Mutation to delete the current organization.
 * Invalidates org lists and redirects to onboarding on success.
 */
export function useDeleteOrganization() {
	const queryClient = useQueryClient();
	const router = useRouter();
	const { data: session } = authClient.useSession();
	const orgId = session?.session?.activeOrganizationId;

	return useMutation({
		mutationFn: async ({ organizationId }: { organizationId: string }) => {
			const result = await authClient.organization.delete({ organizationId });
			if (result.error) {
				throw new Error(
					result.error.message || "Failed to delete organization",
				);
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
			toast.success("Organization deleted successfully");
			// Redirect to onboarding to create/join a new organization
			router.push("/onboarding");
			router.refresh();
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete organization");
		},
	});
}
