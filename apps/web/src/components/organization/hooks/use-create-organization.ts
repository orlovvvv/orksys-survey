"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

interface CreateOrganizationInput {
	name: string;
	slug: string;
}

/**
 * Mutation to create a new organization.
 * Invalidates org lists and sets the new org as active on success.
 */
export function useCreateOrganization() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: async (input: CreateOrganizationInput) => {
			const result = await authClient.organization.create({
				name: input.name,
				slug: input.slug,
			});
			if (result.error) {
				throw new Error(
					result.error.message || "Failed to create organization",
				);
			}
			return result.data;
		},
		onSuccess: async (data) => {
			// Invalidate org-related queries
			queryClient.invalidateQueries({ queryKey: ["organizations"] });
			if (data?.id) {
				await authClient.organization.setActive({
					organizationId: data.id,
				});
			}
			toast.success("Organization created successfully");
			router.refresh();
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to create organization");
		},
	});
}
