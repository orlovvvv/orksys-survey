import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { MemberRole } from "./types";

interface RoleBadgeProps {
	role: MemberRole;
	className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
	const variants: Record<MemberRole, "default" | "secondary" | "outline"> = {
		owner: "default",
		admin: "secondary",
		member: "outline",
	};

	const labels: Record<MemberRole, string> = {
		owner: "Owner",
		admin: "Admin",
		member: "Member",
	};

	return (
		<Badge variant={variants[role]} className={cn("text-xs", className)}>
			{labels[role]}
		</Badge>
	);
}
