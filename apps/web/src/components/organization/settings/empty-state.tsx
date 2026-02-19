"use client";

import { Building2 } from "lucide-react";

export function NoOrganizationState() {
	return (
		<div className="flex min-h-[50vh] items-center justify-center">
			<div className="text-center">
				<Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
				<h2 className="mb-2 font-semibold text-lg">No Organization Found</h2>
				<p className="mb-6 text-muted-foreground text-sm">
					You need to be part of an organization to access settings.
				</p>
			</div>
		</div>
	);
}
