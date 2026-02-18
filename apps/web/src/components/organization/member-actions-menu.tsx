"use client";

import {
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
import type { MemberRole } from "./types";

interface MemberActionsMenuProps {
	memberId: string;
	memberEmail: string;
	currentRole: MemberRole;
	isOwner: boolean;
	isSelf: boolean;
	canManage: boolean;
	onRemoveMember: (memberIdOrEmail: string) => void;
	onUpdateRole: (memberId: string, role: MemberRole) => void;
	isRemoving?: boolean;
}

export function MemberActionsMenu({
	memberId,
	memberEmail,
	currentRole,
	isOwner,
	isSelf,
	canManage,
	onRemoveMember,
	onUpdateRole,
	isRemoving = false,
}: MemberActionsMenuProps) {
	const [showRemoveDialog, setShowRemoveDialog] = React.useState(false);
	const [isUpdating, setIsUpdating] = React.useState(false);

	const handleRemoveMember = () => {
		onRemoveMember(memberEmail);
		setShowRemoveDialog(false);
	};

	const handleUpdateRole = async (newRole: MemberRole) => {
		setIsUpdating(true);
		try {
			onUpdateRole(memberId, newRole);
		} finally {
			setIsUpdating(false);
		}
	};

	const canChangeRole = canManage && !isOwner && !isSelf;
	const canRemove = canManage && !isOwner && !isSelf;

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8"
							disabled={!canManage}
						>
							<MoreHorizontal className="h-4 w-4" />
							<span className="sr-only">Open menu</span>
						</Button>
					}
				/>
				<DropdownMenuContent align="end">
					<DropdownMenuGroup>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger disabled={!canChangeRole || isUpdating}>
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
		</>
	);
}
