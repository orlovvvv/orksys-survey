"use client";

import { Building2, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export interface OrganizationHeaderProps {
	name: string;
	memberCount: number;
}

export function OrganizationHeader({
	name,
	memberCount,
}: OrganizationHeaderProps) {
	return (
		<div className="flex items-center gap-3">
			<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
				<Building2 className="h-5 w-5 text-primary" />
			</div>
			<div className="flex items-center gap-3">
				<div>
					<h1 className="font-bold text-2xl text-foreground">{name}</h1>
					<p className="text-muted-foreground text-sm">
						Manage members and invitations for your organization
					</p>
				</div>
				<Badge variant="secondary" className="gap-1.5">
					<Users className="h-3 w-3" />
					{memberCount} member{memberCount !== 1 ? "s" : ""}
				</Badge>
			</div>
		</div>
	);
}
