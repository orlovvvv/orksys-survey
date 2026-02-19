"use client";

import * as React from "react";

import type { Member, MemberRole } from "../types";

/**
 * Hook to compute permission-related values for organization settings.
 */
export function useSettingsPermissions(
	members: Member[],
	currentUserId: string,
): {
	canManage: boolean;
	currentUserRole: MemberRole;
	isSelf: (userId: string) => boolean;
} {
	const currentUserRole: MemberRole = React.useMemo(() => {
		const member = members.find((m) => m.userId === currentUserId);
		return member?.role ?? "member";
	}, [members, currentUserId]);

	const canManage = currentUserRole === "owner" || currentUserRole === "admin";

	const isSelf = React.useCallback(
		(userId: string) => userId === currentUserId,
		[currentUserId],
	);

	return { canManage, currentUserRole, isSelf };
}
