"use client";

import {
	Crown,
	LogOut,
	MoreHorizontal,
	Shield,
	ShieldCheck,
	Trash2,
	User,
} from "lucide-react";
import * as React from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { TransferOwnershipDialog } from "./member/transfer-ownership-dialog";
import type { MemberRole } from "./types";

interface MemberActionsMenuProps {
	memberId: string;
	memberEmail: string;
	memberName: string;
	currentRole: MemberRole;
	currentUserRole: MemberRole;
	isOwner: boolean;
	isSelf: boolean;
	isOnlyOwner?: boolean;
	canManage: boolean;
	onRemoveMember: (memberIdOrEmail: string) => void;
	onUpdateRole: (memberId: string, role: MemberRole) => void;
	onLeaveOrganization?: () => void;
	onTransferOwnership?: (memberId: string) => void;
	isRemoving?: boolean;
	isLeaving?: boolean;
	isTransferringOwnership?: boolean;
}

export function MemberActionsMenu({
	memberId,
	memberEmail,
	memberName,
	currentRole,
	currentUserRole,
	isOwner,
	isSelf,
	isOnlyOwner = false,
	canManage,
	onRemoveMember,
	onUpdateRole,
	onLeaveOrganization,
	onTransferOwnership,
	isRemoving = false,
	isLeaving = false,
	isTransferringOwnership = false,
}: MemberActionsMenuProps) {
	const [showRemoveDialog, setShowRemoveDialog] = React.useState(false);
	const [showLeaveDialog, setShowLeaveDialog] = React.useState(false);
	const [showTransferDialog, setShowTransferDialog] = React.useState(false);
	const [isUpdating, setIsUpdating] = React.useState(false);

	const handleRemoveMember = () => {
		onRemoveMember(memberEmail);
		setShowRemoveDialog(false);
	};

	const handleLeaveOrganization = () => {
		onLeaveOrganization?.();
		setShowLeaveDialog(false);
	};

	const handleUpdateRole = async (newRole: MemberRole) => {
		setIsUpdating(true);
		try {
			onUpdateRole(memberId, newRole);
		} finally {
			setIsUpdating(false);
		}
	};

	const handleTransferOwnership = () => {
		onTransferOwnership?.(memberId);
		setShowTransferDialog(false);
	};

	const canChangeRole = canManage && !isOwner && !isSelf;
	const canRemove = canManage && !isOwner && !isSelf;
	// Transfer ownership: only owner can transfer, not to self, not to existing owner
	const canTransferOwnership =
		currentUserRole === "owner" && !isSelf && !isOwner;

	// Self row: show Leave Organization action
	if (isSelf && !canManage) {
		if (isOwner) {
			return null; // Owners can't leave via menu, need to transfer ownership first
		}

		return (
			<>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setShowLeaveDialog(true)}
					disabled={isLeaving}
					className="text-muted-foreground"
				>
					<LogOut className="mr-2 h-4 w-4" />
					Leave
				</Button>

				<AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Leave Organization</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to leave this organization? You will lose
								access to all shared resources, surveys, and data. This action
								cannot be undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleLeaveOrganization}
								disabled={isLeaving}
								className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							>
								{isLeaving ? "Leaving..." : "Leave Organization"}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</>
		);
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button variant="ghost" size="icon" className="h-8 w-8">
							<MoreHorizontal className="h-4 w-4" />
							<span className="sr-only">Open menu</span>
						</Button>
					}
				/>
				<DropdownMenuContent align="end">
					{isSelf ? (
						// Self actions: only leave organization
						<DropdownMenuGroup>
							{isOnlyOwner ? (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger
											render={
												<DropdownMenuItem disabled>
													<LogOut className="mr-2 h-4 w-4" />
													Leave Organization
												</DropdownMenuItem>
											}
										/>
										<TooltipContent>
											<p>You cannot leave as the only owner.</p>
											<p>Transfer ownership to another member first.</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							) : isOwner ? (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger
											render={
												<DropdownMenuItem disabled>
													<LogOut className="mr-2 h-4 w-4" />
													Leave Organization
												</DropdownMenuItem>
											}
										/>
										<TooltipContent>
											<p>Owners cannot leave directly.</p>
											<p>Transfer ownership first if needed.</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							) : (
								<DropdownMenuItem
									variant="destructive"
									disabled={isLeaving}
									onClick={() => setShowLeaveDialog(true)}
								>
									<LogOut className="mr-2 h-4 w-4" />
									Leave Organization
								</DropdownMenuItem>
							)}
						</DropdownMenuGroup>
					) : (
						// Other member actions: role change, transfer ownership, and remove
						<>
							{canTransferOwnership && (
								<>
									<DropdownMenuGroup>
										<DropdownMenuItem
											variant="destructive"
											disabled={isTransferringOwnership}
											onClick={() => setShowTransferDialog(true)}
										>
											<Crown className="mr-2 h-4 w-4" />
											Transfer Ownership
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
								</>
							)}
							<DropdownMenuGroup>
								<DropdownMenuSub>
									<DropdownMenuSubTrigger
										disabled={!canChangeRole || isUpdating}
									>
										<Shield className="mr-2 h-4 w-4" />
										Change Role
									</DropdownMenuSubTrigger>
									<DropdownMenuSubContent>
										<DropdownMenuItem
											onClick={() => handleUpdateRole("member")}
											disabled={
												!canChangeRole || isUpdating || currentRole === "member"
											}
										>
											<User className="mr-2 h-4 w-4" />
											Member
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => handleUpdateRole("admin")}
											disabled={
												!canChangeRole || isUpdating || currentRole === "admin"
											}
										>
											<ShieldCheck className="mr-2 h-4 w-4" />
											Admin
										</DropdownMenuItem>
									</DropdownMenuSubContent>
								</DropdownMenuSub>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem
									variant="destructive"
									disabled={!canRemove || isRemoving}
									onClick={() => setShowRemoveDialog(true)}
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Remove Member
								</DropdownMenuItem>
							</DropdownMenuGroup>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Remove Member</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to remove{" "}
							<span className="font-medium">{memberEmail}</span> from this
							organization? This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleRemoveMember}
							disabled={isRemoving}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isRemoving ? "Removing..." : "Remove Member"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Leave Organization</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to leave this organization? You will lose
							access to all shared resources, surveys, and data. This action
							cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleLeaveOrganization}
							disabled={isLeaving}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isLeaving ? "Leaving..." : "Leave Organization"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<TransferOwnershipDialog
				newOwnerName={memberName}
				newOwnerEmail={memberEmail}
				open={showTransferDialog}
				onOpenChange={setShowTransferDialog}
				onTransfer={handleTransferOwnership}
				isTransferring={isTransferringOwnership}
			/>
		</>
	);
}
