"use client";

import { Loader2, Plus } from "lucide-react";

import {
	InvitationList,
	InviteMemberDialog,
	ReceivedInvitationList,
} from "@/components/organization";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import type { Invitation, ReceivedInvitation } from "../types";

export interface InvitationsTabProps {
	invitations: Invitation[];
	canManage: boolean;
	isLoading: boolean;
	isCanceling: string | null;
	onInviteSuccess: () => void;
	onCancelInvitation: (invitationId: string) => Promise<void>;
	// Received invitations props
	receivedInvitations: ReceivedInvitation[];
	isLoadingReceived: boolean;
	respondingId: string | null;
	onAcceptInvitation: (invitationId: string) => void;
	onDeclineInvitation: (invitationId: string) => void;
}

export function InvitationsTab({
	invitations,
	canManage,
	isLoading,
	isCanceling,
	onInviteSuccess,
	onCancelInvitation,
	receivedInvitations,
	isLoadingReceived,
	respondingId,
	onAcceptInvitation,
	onDeclineInvitation,
}: InvitationsTabProps) {
	return (
		<div className="space-y-8">
			{/* Sent Invitations Section */}
			<div className="space-y-4">
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
							onSuccess={onInviteSuccess}
						/>
					)}
				</div>

				{isLoading ? (
					<div className="flex justify-center py-12">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				) : (
					<InvitationList
						invitations={invitations}
						onCancelInvitation={onCancelInvitation}
						isCanceling={isCanceling}
					/>
				)}
			</div>

			<Separator />

			{/* Received Invitations Section */}
			<div className="space-y-4">
				<div>
					<h2 className="font-semibold text-lg">Your Invitations</h2>
					<p className="text-muted-foreground text-sm">
						Invitations you've received from other organizations
					</p>
				</div>

				{isLoadingReceived ? (
					<div className="flex justify-center py-12">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				) : (
					<ReceivedInvitationList
						invitations={receivedInvitations}
						onAccept={onAcceptInvitation}
						onDecline={onDeclineInvitation}
						respondingId={respondingId}
					/>
				)}
			</div>
		</div>
	);
}
