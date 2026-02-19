"use client";

import { InfoIcon } from "lucide-react";

import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

export interface WidgetTooltipProps {
	title: string;
	description: string;
	calculation?: string;
	dataPortrayal?: string;
	className?: string;
}

export function WidgetTooltip({
	title,
	description,
	calculation,
	dataPortrayal,
	className,
}: WidgetTooltipProps) {
	return (
		<HoverCard>
			<HoverCardTrigger>
				<button
					type="button"
					className={cn(
						"inline-flex items-center justify-center rounded-full",
						"transition-colors focus-visible:outline-none focus-visible:ring-2",
						"focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
						"h-5 w-5 text-muted-foreground hover:bg-muted hover:text-foreground",
						className,
					)}
					aria-label={`About ${title}`}
				>
					<InfoIcon className="h-3 w-3" />
				</button>
			</HoverCardTrigger>
			<HoverCardContent
				side="top"
				align="start"
				className="w-72 space-y-2 text-sm"
			>
				<div>
					<h4 className="font-medium text-foreground">{title}</h4>
				</div>
				<div>
					<p className="text-muted-foreground text-xs leading-relaxed">
						{description}
					</p>
				</div>
				{calculation && (
					<div>
						<p className="text-muted-foreground text-xs">
							<span className="font-medium text-foreground">Calculation:</span>{" "}
							{calculation}
						</p>
					</div>
				)}
				{dataPortrayal && (
					<div>
						<p className="text-muted-foreground text-xs">
							<span className="font-medium text-foreground">Data:</span>{" "}
							{dataPortrayal}
						</p>
					</div>
				)}
			</HoverCardContent>
		</HoverCard>
	);
}
