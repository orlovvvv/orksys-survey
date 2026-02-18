"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { Button } from "../ui/button";

interface Organization {
	id: string;
	name: string;
	slug: string;
}

interface SelectOrganizationProps {
	organizations: Organization[];
}

export default function SelectOrganization({
	organizations,
}: SelectOrganizationProps) {
	const router = useRouter();

	const handleSelectOrganization = async (organizationId: string) => {
		try {
			const result = await authClient.organization.setActive({
				organizationId,
			});

			if (result.error) {
				toast.error(
					result.error.message || "Failed to set active organization",
				);
				return;
			}

			toast.success("Organization selected");
			router.push("/dashboard");
			router.refresh();
		} catch (_error) {
			toast.error("An unexpected error occurred");
		}
	};

	return (
		<div className="space-y-2">
			{organizations.map((org) => (
				<Button
					key={org.id}
					variant="outline"
					className="w-full justify-start"
					onClick={() => handleSelectOrganization(org.id)}
				>
					<span className="font-medium">{org.name}</span>
					<span className="ml-2 text-muted-foreground text-sm">
						({org.slug})
					</span>
				</Button>
			))}
		</div>
	);
}
