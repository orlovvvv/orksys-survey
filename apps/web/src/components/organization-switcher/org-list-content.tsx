"use client";

import { PlusCircle } from "lucide-react";
import { useCallback } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import type { Organization } from "./use-organizations";

interface OrgListContentProps {
	organizations: Organization[];
	activeOrgId: string | undefined;
	onSelectOrg: (orgId: string) => void;
	onCreateOrg: () => void;
}

export function OrgListContent({
	organizations,
	activeOrgId,
	onSelectOrg,
	onCreateOrg,
}: OrgListContentProps) {
	const handleSelect = useCallback(
		(orgId: string) => {
			onSelectOrg(orgId);
		},
		[onSelectOrg],
	);

	return (
		<Command>
			<CommandInput placeholder="Search organization..." />
			<CommandList>
				<CommandEmpty>No organization found.</CommandEmpty>
				<CommandGroup heading="Organizations">
					{organizations.map((org) => {
						const isActive = org.id === activeOrgId;
						return (
							<CommandItem
								key={org.id}
								onSelect={() => handleSelect(org.id)}
								className="gap-2"
								data-checked={isActive}
							>
								<Avatar className="size-6">
									<AvatarFallback className="text-xs">
										{org.name.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<span className="text-sm">{org.name}</span>
							</CommandItem>
						);
					})}
				</CommandGroup>
			</CommandList>
			<CommandSeparator />
			<CommandList>
				<CommandGroup>
					<CommandItem onSelect={onCreateOrg} className="gap-2">
						<PlusCircle className="size-4" />
						<span className="text-sm">Create organization</span>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
