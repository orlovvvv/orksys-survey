import { Building2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrganizationInfoCardProps {
	organization: {
		id: string;
		name: string;
		slug: string;
		logo?: string | null;
	};
	owner?: {
		id: string;
		name: string;
		email: string;
		image?: string | null;
	} | null;
}

export function OrganizationInfoCard({
	organization,
	owner,
}: OrganizationInfoCardProps) {
	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-base">
					<Building2 className="h-4 w-4 text-muted-foreground" />
					Organization
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Organization Info */}
				<div className="flex items-center gap-3">
					{organization.logo ? (
						<img
							src={organization.logo}
							alt={organization.name}
							className="h-10 w-10 rounded-md object-cover"
						/>
					) : (
						<div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
							<Building2 className="h-5 w-5 text-primary" />
						</div>
					)}
					<div className="min-w-0 flex-1">
						<p className="truncate font-medium text-sm">{organization.name}</p>
						<Badge variant="secondary" className="mt-0.5 text-xs">
							{organization.slug}
						</Badge>
					</div>
				</div>

				{/* Creator Info */}
				{owner && (
					<div className="border-t pt-3">
						<p className="mb-2 text-muted-foreground text-xs">Created by</p>
						<div className="flex items-center gap-3">
							<Avatar size="sm">
								<AvatarImage src={owner.image || undefined} alt={owner.name} />
								<AvatarFallback>
									{owner.name
										.split(" ")
										.map((n) => n[0])
										.join("")
										.toUpperCase()
										.slice(0, 2)}
								</AvatarFallback>
							</Avatar>
							<div className="min-w-0 flex-1">
								<p className="truncate font-medium text-sm">{owner.name}</p>
								<p className="truncate text-muted-foreground text-xs">
									{owner.email}
								</p>
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
