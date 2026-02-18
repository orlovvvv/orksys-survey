"use client";

import { Building2, Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

interface Org {
	id: string;
	name: string;
	slug: string;
}

export default function OrganizationSwitcher() {
	const router = useRouter();
	const { data: session, isPending: isSessionPending } =
		authClient.useSession();
	const [organizations, setOrganizations] = useState<Org[]>([]);
	const [isOrgsPending, setIsOrgsPending] = useState(true);

	useEffect(() => {
		async function fetchOrganizations() {
			try {
				const result = await authClient.organization.list();
				if (result.data) {
					setOrganizations(result.data);
				}
			} catch (error) {
				console.error("Failed to fetch organizations:", error);
			} finally {
				setIsOrgsPending(false);
			}
		}

		if (session?.user) {
			fetchOrganizations();
		}
	}, [session?.user]);

	const isPending = isSessionPending || isOrgsPending;

	if (isPending) {
		return <Skeleton className="h-9 w-40" />;
	}

	if (!session || !organizations || organizations.length === 0) {
		return null;
	}

	const currentOrg = organizations.find(
		(org: Org) => org.id === session.session.activeOrganizationId,
	);

	const handleSwitchOrganization = async (organizationId: string) => {
		try {
			const result = await authClient.organization.setActive({
				organizationId,
			});

			if (result.error) {
				toast.error(result.error.message || "Failed to switch organization");
				return;
			}

			router.refresh();
		} catch (_error) {
			toast.error("An unexpected error occurred");
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={<Button variant="outline" className="gap-2" />}
			>
				<Building2 className="h-4 w-4" />
				<span className="max-w-32 truncate">
					{currentOrg?.name || "Select org"}
				</span>
				<ChevronsUpDown className="h-4 w-4 opacity-50" />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56 bg-card">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Organizations</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{organizations.map((org: Org) => (
						<DropdownMenuItem
							key={org.id}
							onClick={() => handleSwitchOrganization(org.id)}
							className="justify-between"
						>
							<span className="truncate">{org.name}</span>
							{org.id === session.session.activeOrganizationId && (
								<Check className="h-4 w-4" />
							)}
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
