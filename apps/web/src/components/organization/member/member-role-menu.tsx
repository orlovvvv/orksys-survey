"use client";

import { Shield, ShieldCheck, User } from "lucide-react";

import {
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

import type { MemberRole } from "../types";

interface MemberRoleMenuProps {
	currentRole: MemberRole;
	canChangeRole: boolean;
	isUpdating: boolean;
	onUpdateRole: (role: MemberRole) => void;
}

export function MemberRoleMenu({
	currentRole,
	canChangeRole,
	isUpdating,
	onUpdateRole,
}: MemberRoleMenuProps) {
	return (
		<DropdownMenuGroup>
			<DropdownMenuSub>
				<DropdownMenuSubTrigger disabled={!canChangeRole || isUpdating}>
					<Shield className="mr-2 h-4 w-4" />
					Change Role
				</DropdownMenuSubTrigger>
				<DropdownMenuSubContent>
					<DropdownMenuItem
						onClick={() => onUpdateRole("member")}
						disabled={!canChangeRole || isUpdating || currentRole === "member"}
					>
						<User className="mr-2 h-4 w-4" />
						Member
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => onUpdateRole("admin")}
						disabled={!canChangeRole || isUpdating || currentRole === "admin"}
					>
						<ShieldCheck className="mr-2 h-4 w-4" />
						Admin
					</DropdownMenuItem>
				</DropdownMenuSubContent>
			</DropdownMenuSub>
		</DropdownMenuGroup>
	);
}
