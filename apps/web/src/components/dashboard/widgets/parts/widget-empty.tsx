"use client";

import { BarChart3Icon } from "lucide-react";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export interface WidgetEmptyProps {
	title?: string;
	description?: string;
	icon?: React.ReactNode;
}

export function WidgetEmpty({
	title = "No data available",
	description = "There is no data to display for the current filters.",
	icon = <BarChart3Icon className="h-8 w-8" />,
}: WidgetEmptyProps) {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">{icon}</EmptyMedia>
				<EmptyTitle>{title}</EmptyTitle>
				<EmptyDescription>{description}</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
