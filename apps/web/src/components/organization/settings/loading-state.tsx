"use client";

import { Loader2 } from "lucide-react";

export function OrganizationSettingsLoading() {
	return (
		<div className="flex min-h-[50vh] items-center justify-center">
			<div className="text-center">
				<Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-muted-foreground" />
				<p className="text-muted-foreground text-sm">Loading organization...</p>
			</div>
		</div>
	);
}
