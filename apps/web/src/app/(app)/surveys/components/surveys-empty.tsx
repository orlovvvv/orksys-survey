import { ClipboardList, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export interface SurveysEmptyProps {
	organizationName: string | undefined;
	onCreateClick: () => void;
	hasFilters?: boolean;
}

export function SurveysEmpty({
	organizationName,
	onCreateClick,
	hasFilters = false,
}: SurveysEmptyProps) {
	if (hasFilters) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<ClipboardList />
					</EmptyMedia>
					<EmptyTitle>No surveys found</EmptyTitle>
					<EmptyDescription>
						No surveys match your current filters. Try adjusting your search or
						filter criteria.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<ClipboardList />
				</EmptyMedia>
				<EmptyTitle>
					No surveys
					{organizationName ? ` in ${organizationName}` : ""}
				</EmptyTitle>
				<EmptyDescription>
					{organizationName
						? `Create your first survey for ${organizationName} to start collecting responses.`
						: "Create your first survey to start collecting responses."}
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button
					nativeButton={false}
					render={<Link href="/surveys/new" />}
					onClick={onCreateClick}
				>
					<Plus className="mr-2 h-4 w-4" />
					Create Survey
				</Button>
			</EmptyContent>
		</Empty>
	);
}
