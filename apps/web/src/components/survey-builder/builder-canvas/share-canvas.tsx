"use client";

import { DistributionPanel } from "@/components/distribution/distribution-panel";

interface ShareCanvasProps {
	orgSlug: string;
	surveySlug: string;
	status?: string;
}

export function ShareCanvas({ orgSlug, surveySlug, status }: ShareCanvasProps) {
	return (
		<div className="flex-1 overflow-y-auto p-6">
			<DistributionPanel
				orgSlug={orgSlug}
				surveySlug={surveySlug}
				status={status}
			/>
		</div>
	);
}
