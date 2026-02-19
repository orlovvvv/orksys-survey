import { Check, X } from "lucide-react";

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

import type { ReceivedInvitation } from "./types";

interface ReceivedInvitationListProps {
	invitations: ReceivedInvitation[];
	onAccept: (invitationId: string) => void;
	onDecline: (invitationId: string) => void;
	isLoading?: boolean;
	respondingId: string | null;
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
function ReceivedInvitationListSkeleton() {
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<div className="space-y-3">
				{Array.from({ length: 3 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton items have no unique id
					<Skeleton key={i} className="h-24 w-full" />
				))}
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Organization</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Expires</TableHead>
					<TableHead className="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{Array.from({ length: 3 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton items have no unique id
					<TableRow key={i}>
						<TableCell>
							<Skeleton className="h-4 w-32" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-4 w-16" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-4 w-28" />
						</TableCell>
						<TableCell className="text-right">
							<Skeleton className="ml-auto h-8 w-32" />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

// Mobile card for a single invitation
function ReceivedInvitationCard({
	invitation,
	expirationStatus,
	onAccept,
	onDecline,
	isResponding,
}: {
	invitation: ReceivedInvitation;
	expirationStatus: { text: string; className: string };
	onAccept: (invitationId: string) => void;
	onDecline: (invitationId: string) => void;
	isResponding: boolean;
}) {
	return (
		<Card size="sm">
			<CardContent className="flex flex-col gap-3">
				<div className="flex items-start justify-between gap-2">
					<div className="flex min-w-0 flex-1 flex-col gap-1">
						<p className="truncate font-medium text-sm">
							{invitation.organizationName}
						</p>
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
					<div className="flex gap-2">
						<Button
							variant="default"
							size="sm"
							onClick={() => onAccept(invitation.id)}
							disabled={isResponding}
						>
							<Check className="mr-1 h-3 w-3" />
							Accept
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onDecline(invitation.id)}
							disabled={isResponding}
						>
							<X className="mr-1 h-3 w-3" />
							Decline
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function ReceivedInvitationList({
	invitations,
	onAccept,
	onDecline,
	isLoading = false,
	respondingId,
}: ReceivedInvitationListProps) {
	const isMobile = useIsMobile();

	// Filter for pending invitations only
	const pendingInvitations = invitations.filter(
		(inv) => inv.status === "pending",
	);

	// Show loading skeleton
	if (isLoading) {
		return <ReceivedInvitationListSkeleton />;
	}

	// Empty state
	if (pendingInvitations.length === 0) {
		return (
			<EmptyState
				title="No pending invitations"
				description="You don't have any pending invitations from other organizations."
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
						<ReceivedInvitationCard
							key={invitation.id}
							invitation={invitation}
							expirationStatus={expirationStatus}
							onAccept={onAccept}
							onDecline={onDecline}
							isResponding={respondingId === invitation.id}
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
					<TableHead>Organization</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Expires</TableHead>
					<TableHead className="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{pendingInvitations.map((invitation) => {
					const expirationStatus = getExpirationStatus(invitation.expiresAt);
					const isResponding = respondingId === invitation.id;
					return (
						<TableRow key={invitation.id}>
							<TableCell className="font-medium">
								{invitation.organizationName}
							</TableCell>
							<TableCell>
								<RoleBadge role={invitation.role} />
							</TableCell>
							<TableCell>
								<span className={expirationStatus.className}>
									{expirationStatus.text}
								</span>
							</TableCell>
							<TableCell className="text-right">
								<div className="flex justify-end gap-2">
									<Button
										variant="default"
										size="sm"
										onClick={() => onAccept(invitation.id)}
										disabled={isResponding}
									>
										<Check className="mr-1 h-3 w-3" />
										{isResponding ? "Accepting..." : "Accept"}
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => onDecline(invitation.id)}
										disabled={isResponding}
									>
										<X className="mr-1 h-3 w-3" />
										Decline
									</Button>
								</div>
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}
