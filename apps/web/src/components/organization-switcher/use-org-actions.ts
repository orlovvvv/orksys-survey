"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import type { Organization } from "./use-organizations";

export function useOrgActions() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const switchOrganization = useCallback(
		async (organizationId: string) => {
			try {
				const result = await authClient.organization.setActive({
					organizationId,
				});

				if (result.error) {
					toast.error(result.error.message || "Failed to switch organization");
					return false;
				}

				// Invalidate all queries that depend on organization context
				// Use oRPC's query key structure: [["survey"]], [["organization"]], etc.
				queryClient.invalidateQueries({ queryKey: [["survey"]] });
				queryClient.invalidateQueries({ queryKey: [["question"]] });
				queryClient.invalidateQueries({ queryKey: [["analytics"]] });
				queryClient.invalidateQueries({ queryKey: ["organizations"] });

				router.refresh();
				return true;
			} catch (_error) {
				toast.error("An unexpected error occurred");
				return false;
			}
		},
		[router, queryClient],
	);

	const refetchOrganizations = useCallback(async () => {
		const result = await authClient.organization.list();
		return result.data ?? [];
	}, []);

	return { switchOrganization, refetchOrganizations };
}
