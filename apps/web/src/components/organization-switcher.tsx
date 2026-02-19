"use client";

import { useCallback, useState } from "react";

import { Popover, PopoverContent } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth-client";
import { CreateOrgDialog } from "./organization-switcher/create-org-dialog";
import { OrgListContent } from "./organization-switcher/org-list-content";
import { OrgSwitcherTrigger } from "./organization-switcher/org-switcher-trigger";
import { useOrgActions } from "./organization-switcher/use-org-actions";
import { useOrganizations } from "./organization-switcher/use-organizations";

export default function OrganizationSwitcher() {
	const isMobile = useIsMobile();
	const { data: session, isPending: isSessionPending } =
		authClient.useSession();
	const { organizations, isPending: isOrgsPending } = useOrganizations({
		session,
	});
	const { switchOrganization } = useOrgActions();

	const [open, setOpen] = useState(false);
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [isSwitching, setIsSwitching] = useState(false);

	const isPending = isSessionPending || isOrgsPending;

	if (isPending) {
		return <Skeleton className="h-9 w-48" />;
	}

	if (!session || !organizations || organizations.length === 0) {
		return null;
	}

	const currentOrg = organizations.find(
		(org) => org.id === session.session.activeOrganizationId,
	);

	const handleSwitchOrg = async (organizationId: string) => {
		if (isSwitching) return;

		setIsSwitching(true);
		const success = await switchOrganization(organizationId);
		setIsSwitching(false);

		if (success) {
			setOpen(false);
		}
	};

	const handleCreateSuccess = useCallback(() => {
		setShowCreateDialog(false);
	}, []);

	const handleCreateClick = useCallback(() => {
		setOpen(false);
		setShowCreateDialog(true);
	}, []);

	return (
		<>
			<CreateOrgDialog
				open={showCreateDialog}
				onOpenChange={setShowCreateDialog}
				onSuccess={handleCreateSuccess}
			/>

			<Popover open={open} onOpenChange={setOpen}>
				<OrgSwitcherTrigger orgName={currentOrg?.name} open={open} />
				<PopoverContent
					className="w-[280px] p-0"
					align={isMobile ? "center" : "end"}
					side="bottom"
				>
					<OrgListContent
						organizations={organizations}
						activeOrgId={session.session.activeOrganizationId ?? undefined}
						onSelectOrg={handleSwitchOrg}
						onCreateOrg={handleCreateClick}
					/>
				</PopoverContent>
			</Popover>
		</>
	);
}
