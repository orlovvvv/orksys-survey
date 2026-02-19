import { Building2, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface SurveysHeaderProps {
	organizationName: string | undefined;
	surveyCount?: number;
	canCreate?: boolean;
	onCreateClick?: () => void;
}

export function SurveysHeader({
	organizationName,
	canCreate = true,
	onCreateClick,
}: SurveysHeaderProps) {
	return (
		<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-2">
				<h1 className="font-semibold text-xl">Surveys</h1>
				{organizationName && (
					<Badge variant="secondary" className="gap-1.5 text-xs">
						<Building2 className="h-3 w-3" />
						{organizationName}
					</Badge>
				)}
			</div>
			{canCreate && onCreateClick && (
				<Button onClick={onCreateClick}>
					<Plus className="mr-2 h-4 w-4" />
					Create Survey
				</Button>
			)}
		</div>
	);
}
