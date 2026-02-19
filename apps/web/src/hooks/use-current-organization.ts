import { useMemo } from "react";
import type { Organization } from "@/components/organization-switcher/use-organizations";
import { useOrganizations } from "@/components/organization-switcher/use-organizations";
import { authClient } from "@/lib/auth-client";

export function useCurrentOrganization(): Organization | null {
	const { data: session } = authClient.useSession();
	const { organizations, isPending } = useOrganizations({
		session: session as { user?: unknown } | null,
	});

	return useMemo(() => {
		if (isPending || !session?.session.activeOrganizationId || !organizations) {
			return null;
		}
		return (
			organizations.find(
				(org) => org.id === session.session.activeOrganizationId,
			) ?? null
		);
	}, [session, organizations, isPending]);
}
