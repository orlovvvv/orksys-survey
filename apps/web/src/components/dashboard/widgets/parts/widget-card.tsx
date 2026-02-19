"use client";

import type * as React from "react";

import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { WidgetTooltipProps } from "../../widget-tooltip";
import { WidgetTooltip } from "../../widget-tooltip";

export interface WidgetCardProps {
	title: string;
	tooltip?: WidgetTooltipProps;
	action?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
	fullWidth?: boolean;
}

export function WidgetCard({
	title,
	tooltip,
	action,
	children,
	className,
	fullWidth = false,
}: WidgetCardProps) {
	return (
		<Card className={className} data-full-width={fullWidth}>
			<CardHeader>
				<div className="flex items-center gap-2">
					<CardTitle>{title}</CardTitle>
					{tooltip && <WidgetTooltip {...tooltip} />}
				</div>
				{action && <CardAction>{action}</CardAction>}
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}
