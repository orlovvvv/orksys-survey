"use client";

import { LogOut, Trash2 } from "lucide-react";

import { DeleteAccountDialog } from "@/components/account/danger";
import {
	LeaveOrgDialog,
	useLeaveOrganization,
	useOrganizationMembers,
} from "@/components/organization";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export default function DangerSettingsPage() {
	const sessionQuery = authClient.useSession();
	const leaveOrganizationMutation = useLeaveOrganization();
	const { members } = useOrganizationMembers();

	const currentUserId = sessionQuery.data?.user?.id ?? "";
	const activeOrganizationId =
		sessionQuery.data?.session?.activeOrganizationId ?? "";
	const hasActiveOrganization = !!activeOrganizationId;

	// Check if current user is the only owner
	const ownerCount = members.filter((m) => m.role === "owner").length;
	const currentMember = members.find((m) => m.userId === currentUserId);
	const isOnlyOwner = currentMember?.role === "owner" && ownerCount === 1;

	const handleLeaveOrganization = () => {
		if (activeOrganizationId) {
			leaveOrganizationMutation.mutate({
				organizationId: activeOrganizationId,
			});
		}
	};

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
						<Trash2 className="h-5 w-5 text-destructive" />
					</div>
					<div>
						<h1 className="font-bold text-2xl text-foreground">Danger Zone</h1>
						<p className="text-muted-foreground text-sm">
							Irreversible and destructive actions for your account
						</p>
					</div>
				</div>
			</div>

			{/* Leave Organization */}
			{hasActiveOrganization && (
				<Card className="border-destructive/50">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-destructive">
							<LogOut className="h-5 w-5" />
							Leave Organization
						</CardTitle>
						<CardDescription>
							Leave the current organization. You will lose access to all shared
							resources, surveys, and data.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<LeaveOrgDialog
							organizationName="this organization"
							isOnlyOwner={isOnlyOwner}
							onLeave={handleLeaveOrganization}
							isLeaving={leaveOrganizationMutation.isPending}
						/>
					</CardContent>
				</Card>
			)}

			{/* Delete Account */}
			<Card className="border-destructive/50">
				<CardHeader>
					<CardTitle className="text-destructive">Delete Account</CardTitle>
					<CardDescription>
						Permanently delete your account and all associated data. This action
						cannot be undone.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<DeleteAccountDialog />
				</CardContent>
			</Card>
		</div>
	);
}
