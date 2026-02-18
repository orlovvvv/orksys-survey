import { EmptyState } from "@/components/empty-state/empty-state";
import { RoleBadge } from "@/components/organization/role-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

import type { Invitation } from "./types";

interface InvitationListProps {
	invitations: Invitation[];
	onCancelInvitation: (invitationId: string) => void;
	isLoading?: boolean;
	isCanceling?: string | null;
}

// Helper function to get expiration text and class
function getExpirationStatus(expiresAt: Date): {
	text: string;
	className: string;
} {
	const now = new Date();
	const expiresAtDate = new Date(expiresAt);
	const daysUntilExpiry = Math.ceil(
		(expiresAtDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
	);

	if (daysUntilExpiry <= 0) {
		return {
			text: "Expired",
			className: "text-destructive",
		};
	}

	if (daysUntilExpiry === 1) {
		return {
			text: "Expires in 1 day",
			className: "text-muted-foreground",
		};
	}

	return {
		text: `Expires in ${daysUntilExpiry} days`,
		className: "text-muted-foreground",
	};
}

// Format date to locale string
function formatDate(date: Date): string {
	return new Date(date).toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

// Loading skeleton component
function InvitationListSkeleton() {
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<div className="space-y-3">
				{Array.from({ length: 3 }).map((_, i) => (
					// eslint-disable-next-line react/no-array-index-key
					<Skeleton key={i} className="h-24 w-full" />
				))}
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Sent Date</TableHead>
					<TableHead>Expires</TableHead>
					<TableHead className="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{Array.from({ length: 5 }).map((_, i) => (
					// eslint-disable-next-line react/no-array-index-key
					<TableRow key={i}>
						<TableCell>
							<Skeleton className="h-4 w-40" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-4 w-16" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-4 w-24" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-4 w-28" />
						</TableCell>
						<TableCell className="text-right">
							<Skeleton className="ml-auto h-8 w-20" />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

// Mobile card for a single invitation
function InvitationCard({
	invitation,
	expirationStatus,
	onCancelInvitation,
	isCanceling,
}: {
	invitation: Invitation;
	expirationStatus: { text: string; className: string };
	onCancelInvitation: (invitationId: string) => void;
	isCanceling: boolean;
}) {
	return (
		<Card size="sm">
			<CardContent className="flex flex-col gap-3">
				<div className="flex items-start justify-between gap-2">
					<div className="flex min-w-0 flex-1 flex-col gap-1">
						<p className="truncate font-medium text-sm">{invitation.email}</p>
						<div className="flex items-center gap-2">
							<RoleBadge role={invitation.role} />
							<span className="text-muted-foreground text-xs">
								Sent {formatDate(invitation.createdAt)}
							</span>
						</div>
					</div>
				</div>
				<div className="flex items-center justify-between border-t pt-3">
					<span className={expirationStatus.className}>
						{expirationStatus.text}
					</span>
					<Button
						variant="destructive"
						size="sm"
						onClick={() => onCancelInvitation(invitation.id)}
						disabled={isCanceling}
					>
						{isCanceling ? "Canceling..." : "Cancel"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

export function InvitationList({
	invitations,
	onCancelInvitation,
	isLoading = false,
	isCanceling = null,
}: InvitationListProps) {
	const isMobile = useIsMobile();

	// Filter for pending invitations only
	const pendingInvitations = invitations.filter(
		(inv) => inv.status === "pending",
	);

	// Show loading skeleton
	if (isLoading) {
		return <InvitationListSkeleton />;
	}

	// Empty state
	if (pendingInvitations.length === 0) {
		return (
			<EmptyState
				title="No pending invitations"
				description="Invite team members to collaborate on your organization."
			/>
		);
	}

	// Mobile view - card list
	if (isMobile) {
		return (
			<div className="space-y-3">
				{pendingInvitations.map((invitation) => {
					const expirationStatus = getExpirationStatus(invitation.expiresAt);
					return (
						<InvitationCard
							key={invitation.id}
							invitation={invitation}
							expirationStatus={expirationStatus}
							onCancelInvitation={onCancelInvitation}
							isCanceling={isCanceling === invitation.id}
						/>
					);
				})}
			</div>
		);
	}

	// Desktop view - table
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Sent Date</TableHead>
					<TableHead>Expires</TableHead>
					<TableHead className="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{pendingInvitations.map((invitation) => {
					const expirationStatus = getExpirationStatus(invitation.expiresAt);
					return (
						<TableRow key={invitation.id}>
							<TableCell className="font-medium">{invitation.email}</TableCell>
							<TableCell>
								<RoleBadge role={invitation.role} />
							</TableCell>
							<TableCell className="text-muted-foreground">
								{formatDate(invitation.createdAt)}
							</TableCell>
							<TableCell>
								<span className={expirationStatus.className}>
									{expirationStatus.text}
								</span>
							</TableCell>
							<TableCell className="text-right">
								<Button
									variant="destructive"
									size="sm"
									onClick={() => onCancelInvitation(invitation.id)}
									disabled={isCanceling === invitation.id}
								>
									{isCanceling === invitation.id ? "Canceling..." : "Cancel"}
								</Button>
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}
