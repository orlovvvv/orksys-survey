"use client";

import * as React from "react";

import {
	DangerTab,
	InvitationsTab,
	type MemberRole,
	MembersTab,
	NoOrganizationState,
	OrganizationHeader,
	OrganizationSettingsLoading,
	useCancelInvitation,
	useDeleteOrganization,
	useInvitations,
	useLeaveOrganization,
	useOrganizationMembers,
	useReceivedInvitations,
	useRemoveMember,
	useRespondToInvitation,
	useSettingsPermissions,
	useTransferOwnership,
	useUpdateMemberRole,
} from "@/components/organization";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentOrganization } from "@/hooks/use-current-organization";
import { authClient } from "@/lib/auth-client";

export default function OrganizationSettingsPage() {
	const sessionQuery = authClient.useSession();
	const {
		members,
		isLoading: isLoadingMembers,
		refetch: refetchMembers,
	} = useOrganizationMembers();
	const {
		invitations,
		isLoading: isLoadingInvitations,
		refetch: refetchInvitations,
	} = useInvitations();
	const {
		receivedInvitations,
		isLoading: isLoadingReceived,
		refetch: refetchReceived,
	} = useReceivedInvitations();

	const removeMemberMutation = useRemoveMember();
	const updateRoleMutation = useUpdateMemberRole();
	const cancelInvitationMutation = useCancelInvitation();
	const { acceptInvitation, rejectInvitation } = useRespondToInvitation();
	const leaveOrganizationMutation = useLeaveOrganization();
	const deleteOrganizationMutation = useDeleteOrganization();
	const transferOwnershipMutation = useTransferOwnership({
		onSuccess: () => refetchMembers(),
	});

	const [cancelingId, setCancelingId] = React.useState<string | null>(null);
	const [respondingId, setRespondingId] = React.useState<string | null>(null);

	const currentUserId = sessionQuery.data?.user?.id ?? "";
	const activeOrganizationId =
		sessionQuery.data?.session?.activeOrganizationId ?? "";
	const hasActiveOrganization = !!activeOrganizationId;
	const currentOrganization = useCurrentOrganization();
	const orgName = currentOrganization?.name ?? "Organization";

	const { canManage, currentUserRole } = useSettingsPermissions(
		members,
		currentUserId,
	);

	const handleRemoveMember = (memberIdOrEmail: string) => {
		removeMemberMutation.mutate(
			{ memberIdOrEmail },
			{
				onSuccess: () => {
					refetchMembers();
				},
			},
		);
	};

	const handleUpdateRole = (memberId: string, role: MemberRole) => {
		updateRoleMutation.mutate(
			{ memberId, role },
			{
				onSuccess: () => {
					refetchMembers();
				},
			},
		);
	};

	const handleCancelInvitation = async (invitationId: string) => {
		setCancelingId(invitationId);
		try {
			await cancelInvitationMutation.mutateAsync({ invitationId });
			refetchInvitations();
		} finally {
			setCancelingId(null);
		}
	};

	const handleAcceptInvitation = (invitationId: string) => {
		setRespondingId(invitationId);
		acceptInvitation.mutate(
			{ invitationId },
			{
				onSuccess: () => {
					refetchReceived();
				},
				onSettled: () => {
					setRespondingId(null);
				},
			},
		);
	};

	const handleDeclineInvitation = (invitationId: string) => {
		setRespondingId(invitationId);
		rejectInvitation.mutate(
			{ invitationId },
			{
				onSuccess: () => {
					refetchReceived();
				},
				onSettled: () => {
					setRespondingId(null);
				},
			},
		);
	};

	const handleInviteSuccess = () => {
		refetchMembers();
		refetchInvitations();
	};

	const handleLeaveOrganization = () => {
		if (activeOrganizationId) {
			leaveOrganizationMutation.mutate({
				organizationId: activeOrganizationId,
			});
		}
	};

	const handleDeleteOrganization = () => {
		if (activeOrganizationId) {
			deleteOrganizationMutation.mutate({
				organizationId: activeOrganizationId,
			});
		}
	};

	const handleTransferOwnership = (newOwnerMemberId: string) => {
		const currentMember = members.find((m) => m.userId === currentUserId);
		if (!currentMember) return;

		transferOwnershipMutation.mutate({
			newOwnerMemberId,
			previousOwnerMemberId: currentMember.id,
			previousOwnerNewRole: "admin",
		});
	};

	if (sessionQuery.isPending) {
		return <OrganizationSettingsLoading />;
	}

	if (!hasActiveOrganization) {
		return <NoOrganizationState />;
	}

	return (
		<div className="space-y-6">
			<OrganizationHeader name={orgName} memberCount={members.length} />

			<Tabs defaultValue="members">
				<TabsList variant="line" className="mb-6">
					<TabsTrigger value="members">Members</TabsTrigger>
					<TabsTrigger value="invitations">Invitations</TabsTrigger>
					{currentUserRole === "owner" && (
						<TabsTrigger value="danger" className="text-destructive">
							Danger
						</TabsTrigger>
					)}
				</TabsList>

				<TabsContent value="members">
					<MembersTab
						members={members}
						currentUserId={currentUserId}
						currentUserRole={currentUserRole}
						canManage={canManage}
						isLoading={isLoadingMembers}
						isRemovingMember={removeMemberMutation.isPending}
						isLeaving={leaveOrganizationMutation.isPending}
						isTransferringOwnership={transferOwnershipMutation.isPending}
						onInviteSuccess={handleInviteSuccess}
						onRemoveMember={handleRemoveMember}
						onUpdateRole={handleUpdateRole}
						onLeaveOrganization={handleLeaveOrganization}
						onTransferOwnership={handleTransferOwnership}
					/>
				</TabsContent>

				<TabsContent value="invitations">
					<InvitationsTab
						invitations={invitations}
						canManage={canManage}
						isLoading={isLoadingInvitations}
						isCanceling={cancelingId}
						onInviteSuccess={handleInviteSuccess}
						onCancelInvitation={handleCancelInvitation}
						receivedInvitations={receivedInvitations}
						isLoadingReceived={isLoadingReceived}
						respondingId={respondingId}
						onAcceptInvitation={handleAcceptInvitation}
						onDeclineInvitation={handleDeclineInvitation}
					/>
				</TabsContent>

				{currentUserRole === "owner" && (
					<TabsContent value="danger">
						<DangerTab
							organizationId={activeOrganizationId}
							organizationName={orgName}
							memberCount={members.length}
							isDeleting={deleteOrganizationMutation.isPending}
							onDelete={handleDeleteOrganization}
						/>
					</TabsContent>
				)}
			</Tabs>
		</div>
	);
}
