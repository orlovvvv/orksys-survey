"use client";

import { ChevronsUpDown } from "lucide-react";
import { PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { triggerClassName } from "./org-trigger-styles";

interface OrgSwitcherTriggerProps {
	orgName: string | undefined;
	open?: boolean;
}

export function OrgSwitcherTrigger({ orgName, open }: OrgSwitcherTriggerProps) {
	const initial = orgName?.charAt(0).toUpperCase() || "O";

	return (
		<PopoverTrigger
			className={cn(triggerClassName)}
			aria-label="Select an organization"
			aria-expanded={open}
		>
			<div className="flex items-center gap-2">
				<div className="flex size-6 items-center justify-center rounded-md bg-primary font-semibold text-primary-foreground text-xs">
					{initial}
				</div>
				<span className="truncate text-sm">{orgName || "Select org"}</span>
			</div>
			<ChevronsUpDown className="size-4 opacity-50" />
		</PopoverTrigger>
	);
}
