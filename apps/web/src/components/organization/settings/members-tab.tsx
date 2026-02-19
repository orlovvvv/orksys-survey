"use client";

import { Loader2, Plus } from "lucide-react";

import {
	InviteMemberDialog,
	MemberList,
	type MemberRole,
} from "@/components/organization";
import { Button } from "@/components/ui/button";

import type { Member } from "../types";

export interface MembersTabProps {
	members: Member[];
	currentUserId: string;
	currentUserRole: MemberRole;
	canManage: boolean;
	isLoading: boolean;
	isRemovingMember: boolean;
	isLeaving?: boolean;
	isTransferringOwnership?: boolean;
	onInviteSuccess: () => void;
	onRemoveMember: (memberIdOrEmail: string) => void;
	onUpdateRole: (memberId: string, role: MemberRole) => void;
	onLeaveOrganization: () => void;
	onTransferOwnership?: (memberId: string) => void;
}

export function MembersTab({
	members,
	currentUserId,
	currentUserRole,
	canManage,
	isLoading,
	isRemovingMember,
	isLeaving = false,
	isTransferringOwnership = false,
	onInviteSuccess,
	onRemoveMember,
	onUpdateRole,
	onLeaveOrganization,
	onTransferOwnership,
}: MembersTabProps) {
	return (
		<div className="space-y-6">
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
						onSuccess={onInviteSuccess}
					/>
				)}
			</div>

			{isLoading ? (
				<div className="flex justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			) : (
				<MemberList
					members={members}
					currentUserId={currentUserId}
					isLoading={isLoading}
					onRemoveMember={onRemoveMember}
					onUpdateRole={onUpdateRole}
					currentUserRole={currentUserRole}
					isRemovingMember={isRemovingMember}
					isLeaving={isLeaving}
					onLeaveOrganization={onLeaveOrganization}
					onTransferOwnership={onTransferOwnership}
					isTransferringOwnership={isTransferringOwnership}
				/>
			)}
		</div>
	);
}
