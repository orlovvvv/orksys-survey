"use client";

import { Building2, Loader2, Plus } from "lucide-react";
import * as React from "react";
import {
	InvitationList,
	InviteMemberDialog,
	MemberList,
	type MemberRole,
	useCancelInvitation,
	useInvitations,
	useOrganizationMembers,
	useRemoveMember,
	useUpdateMemberRole,
} from "@/components/organization";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

	const removeMemberMutation = useRemoveMember();
	const updateRoleMutation = useUpdateMemberRole();
	const cancelInvitationMutation = useCancelInvitation();

	const [cancelingId, setCancelingId] = React.useState<string | null>(null);

	// Get current user's ID
	const currentUserId = sessionQuery.data?.user?.id ?? "";
	const hasActiveOrganization =
		!!sessionQuery.data?.session?.activeOrganizationId;

	// Find current user's role from members list
	const currentUserRole: MemberRole = React.useMemo(() => {
		const member = members.find((m) => m.userId === currentUserId);
		return member?.role ?? "member";
	}, [members, currentUserId]);

	// Check if current user can manage members/invitations
	const canManage = currentUserRole === "owner" || currentUserRole === "admin";

	// Handle remove member
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

	// Handle update role
	const handleUpdateRole = (
		memberId: string,
		role: "owner" | "admin" | "member",
	) => {
		updateRoleMutation.mutate(
			{ memberId, role },
			{
				onSuccess: () => {
					refetchMembers();
				},
			},
		);
	};

	// Handle cancel invitation
	const handleCancelInvitation = async (invitationId: string) => {
		setCancelingId(invitationId);
		try {
			await cancelInvitationMutation.mutateAsync({ invitationId });
			refetchInvitations();
		} finally {
			setCancelingId(null);
		}
	};

	// Loading state
	if (sessionQuery.isPending) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<div className="text-center">
					<Spinner className="mx-auto mb-4 h-8 w-8" />
					<p className="text-muted-foreground text-sm">
						Loading organization...
					</p>
				</div>
			</div>
		);
	}

	// No active organization
	if (!hasActiveOrganization) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<div className="text-center">
					<Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
					<h2 className="mb-2 font-semibold text-lg">No Organization Found</h2>
					<p className="mb-6 text-muted-foreground text-sm">
						You need to be part of an organization to access settings.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-6xl p-6">
			{/* Page Header */}
			<div className="mb-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="font-bold text-2xl text-foreground">
							Organization Settings
						</h1>
						<p className="text-muted-foreground">
							Manage members and invitations for your organization
						</p>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<Tabs defaultValue="members">
				<TabsList variant="line" className="mb-6">
					<TabsTrigger value="members">Members</TabsTrigger>
					<TabsTrigger value="invitations">Invitations</TabsTrigger>
				</TabsList>

				{/* Members Tab */}
				<TabsContent value="members" className="space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="font-semibold text-lg">Team Members</h2>
							<p className="text-muted-foreground text-sm">
								Manage access and permissions for your team
							</p>
						</div>
						{canManage && (
							<InviteMemberDialog
								trigger={
									<Button>
										<Plus className="mr-2 h-4 w-4" />
										Invite Member
									</Button>
								}
								onSuccess={() => {
									refetchMembers();
									refetchInvitations();
								}}
							/>
						)}
					</div>

					<MemberList
						members={members}
						currentUserId={currentUserId}
						isLoading={isLoadingMembers}
						onRemoveMember={handleRemoveMember}
						onUpdateRole={handleUpdateRole}
						currentUserRole={currentUserRole}
						isRemovingMember={removeMemberMutation.isPending}
					/>
				</TabsContent>

				{/* Invitations Tab */}
				<TabsContent value="invitations" className="space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="font-semibold text-lg">Pending Invitations</h2>
							<p className="text-muted-foreground text-sm">
								{canManage
									? "Manage and cancel pending invitations"
									: "View pending invitations to your organization"}
							</p>
						</div>
						{canManage && (
							<InviteMemberDialog
								trigger={
									<Button>
										<Plus className="mr-2 h-4 w-4" />
										Invite Member
									</Button>
								}
								onSuccess={() => {
									refetchMembers();
									refetchInvitations();
								}}
							/>
						)}
					</div>

					{isLoadingInvitations ? (
						<div className="flex justify-center py-12">
							<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
						</div>
					) : (
						<InvitationList
							invitations={invitations}
							onCancelInvitation={handleCancelInvitation}
							isCanceling={cancelingId}
						/>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
