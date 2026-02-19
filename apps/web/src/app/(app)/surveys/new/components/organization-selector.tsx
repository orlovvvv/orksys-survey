"use client";

import { Building2, Loader2 } from "lucide-react";
import type { Organization } from "@/components/organization-switcher/use-organizations";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface OrganizationSelectorProps {
	organizations: Organization[];
	activeOrgId: string | undefined;
	onOrgChange: (orgId: string) => Promise<void>;
	isSwitching?: boolean;
}

export function OrganizationSelector({
	organizations,
	activeOrgId,
	onOrgChange,
	isSwitching = false,
}: OrganizationSelectorProps) {
	const handleValueChange = (value: string | null) => {
		if (value) {
			onOrgChange(value);
		}
	};

	const selectedOrg = organizations.find((org) => org.id === activeOrgId);

	return (
		<div className="space-y-2">
			<Label>
				<Building2 className="mr-1 inline h-4 w-4" />
				Organization
			</Label>
			<Select
				value={activeOrgId ?? null}
				onValueChange={handleValueChange}
				disabled={isSwitching}
			>
				<SelectTrigger className="w-full">
					{isSwitching ? (
						<div className="flex items-center gap-2">
							<Loader2 className="h-4 w-4 animate-spin" />
							<span>Switching...</span>
						</div>
					) : selectedOrg ? (
						<span>{selectedOrg.name}</span>
					) : (
						<SelectValue placeholder="Select organization" />
					)}
				</SelectTrigger>
				<SelectContent>
					{organizations.map((org) => (
						<SelectItem key={org.id} value={org.id}>
							{org.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<p className="text-muted-foreground text-xs">
				Survey will be created in this organization
			</p>
		</div>
	);
}
