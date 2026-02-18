"use client";

import { formatDistanceToNow } from "date-fns";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/empty-state/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { MemberActionsMenu } from "./member-actions-menu";
import { RoleBadge } from "./role-badge";
import type { Member } from "./types";

interface MemberListProps {
	members: Member[];
	currentUserId: string;
	isLoading?: boolean;
	onRemoveMember: (memberIdOrEmail: string) => void;
	onUpdateRole: (memberId: string, role: "owner" | "admin" | "member") => void;
	currentUserRole: "owner" | "admin" | "member";
	isRemovingMember?: boolean;
}

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function canCurrentUserManage(
	currentUserRole: "owner" | "admin" | "member",
): boolean {
	return currentUserRole === "owner" || currentUserRole === "admin";
}

function LoadingSkeleton() {
	return (
		<div className="space-y-2">
			{Array.from({ length: 5 }).map((_, i) => (
				<Skeleton key={i} className="h-14 w-full" />
			))}
		</div>
	);
}

function MobileMemberCard({
	member,
	currentUserId,
	currentUserRole,
	isRemovingMember,
	onRemoveMember,
	onUpdateRole,
}: {
	member: Member;
	currentUserId: string;
	currentUserRole: "owner" | "admin" | "member";
	isRemovingMember?: boolean;
	onRemoveMember: (memberIdOrEmail: string) => void;
	onUpdateRole: (memberId: string, role: "owner" | "admin" | "member") => void;
}) {
	const isOwner = member.role === "owner";
	const isSelf = member.userId === currentUserId;
	const canManage = canCurrentUserManage(currentUserRole);

	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-3">
						<Avatar>
							{member.user.image ? (
								<AvatarImage src={member.user.image} alt={member.user.name} />
							) : null}
							<AvatarFallback>{getInitials(member.user.name)}</AvatarFallback>
						</Avatar>
						<div>
							<p className="font-medium">{member.user.name}</p>
							<p className="text-muted-foreground text-sm">
								{member.user.email}
							</p>
							<div className="mt-1 flex items-center gap-2">
								<RoleBadge role={member.role} />
								<span className="text-muted-foreground text-xs">
									Joined{" "}
									{formatDistanceToNow(new Date(member.createdAt), {
										addSuffix: true,
									})}
								</span>
							</div>
						</div>
					</div>
					<MemberActionsMenu
						memberId={member.id}
						memberEmail={member.user.email}
						currentRole={member.role}
						isOwner={isOwner}
						isSelf={isSelf}
						canManage={canManage}
						onRemoveMember={onRemoveMember}
						onUpdateRole={onUpdateRole}
						isRemoving={isRemovingMember}
					/>
				</div>
			</CardContent>
		</Card>
	);
}

export function MemberList({
	members,
	currentUserId,
	isLoading = false,
	onRemoveMember,
	onUpdateRole,
	currentUserRole,
	isRemovingMember = false,
}: MemberListProps) {
	const isMobile = useIsMobile();
	const canManage = canCurrentUserManage(currentUserRole);

	if (isLoading) {
		return <LoadingSkeleton />;
	}

	if (members.length === 0) {
		return (
			<EmptyState
				icon={Users}
				title="No members yet"
				description="Members will appear here once they join the organization."
			/>
		);
	}

	if (isMobile) {
		return (
			<div className="space-y-2">
				{members.map((member) => (
					<MobileMemberCard
						key={member.id}
						member={member}
						currentUserId={currentUserId}
						currentUserRole={currentUserRole}
						isRemovingMember={isRemovingMember}
						onRemoveMember={onRemoveMember}
						onUpdateRole={onUpdateRole}
					/>
				))}
			</div>
		);
	}

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Member</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Joined</TableHead>
						{canManage && <TableHead className="w-[70px]">Actions</TableHead>}
					</TableRow>
				</TableHeader>
				<TableBody>
					{members.map((member) => {
						const isOwner = member.role === "owner";
						const isSelf = member.userId === currentUserId;

						return (
							<TableRow key={member.id}>
								<TableCell>
									<div className="flex items-center gap-3">
										<Avatar size="sm">
											{member.user.image ? (
												<AvatarImage
													src={member.user.image}
													alt={member.user.name}
												/>
											) : null}
											<AvatarFallback>
												{getInitials(member.user.name)}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-medium">{member.user.name}</p>
											<p className="text-muted-foreground text-sm">
												{member.user.email}
											</p>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<RoleBadge role={member.role} />
								</TableCell>
								<TableCell className="text-muted-foreground text-sm">
									{formatDistanceToNow(new Date(member.createdAt), {
										addSuffix: true,
									})}
								</TableCell>
								{canManage && (
									<TableCell>
										<MemberActionsMenu
											memberId={member.id}
											memberEmail={member.user.email}
											currentRole={member.role}
											isOwner={isOwner}
											isSelf={isSelf}
											canManage={canManage}
											onRemoveMember={onRemoveMember}
											onUpdateRole={onUpdateRole}
											isRemoving={isRemovingMember}
										/>
									</TableCell>
								)}
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
