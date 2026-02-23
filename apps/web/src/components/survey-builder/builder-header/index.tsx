"use client";

import {
	ArrowLeft,
	BarChart3,
	Eye,
	MoreHorizontal,
	Pencil,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SurveyBuilderContext } from "../context";
import { SurveySettingsDialog } from "../survey-settings-dialog";
import { BuilderTabs } from "./builder-tabs";

const statusColors: Record<string, string> = {
	draft: "bg-muted text-muted-foreground",
	published: "bg-success/10 text-success",
	closed: "bg-warning/10 text-warning",
	archived: "bg-muted text-muted-foreground",
};

interface BuilderHeaderProps {
	leftActions?: React.ReactNode;
	rightActions?: React.ReactNode;
}

export function BuilderHeader({
	leftActions,
	rightActions,
}: BuilderHeaderProps) {
	const send = SurveyBuilderContext.useActorRef().send;
	const survey = SurveyBuilderContext.useSelector((s) => s.context.survey);
	const activeTab = SurveyBuilderContext.useSelector(
		(s) => s.context.activeTab,
	);
	const settingsOpen = SurveyBuilderContext.useSelector(
		(s) => s.context.settingsOpen,
	);

	const handleTabChange = (tab: "build" | "preview" | "share") => {
		send({ type: "SET_TAB", tab });
	};

	return (
		<header className="z-20 flex shrink-0 items-center justify-between border-border border-b bg-card px-6 py-3">
			<div className="flex items-center gap-4">
				{leftActions}
				<Button
					variant="ghost"
					size="sm"
					nativeButton={false}
					render={<Link href="/surveys" />}
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back
				</Button>
				<div className="flex items-center gap-2 font-sans font-semibold text-foreground text-sm">
					<span className="text-muted-foreground">Surveys /</span>
					<span>{survey.title}</span>
					<Badge variant="secondary" className={statusColors[survey.status]}>
						{survey.status}
					</Badge>
				</div>
			</div>

			<BuilderTabs
				activeTab={activeTab}
				setActiveTab={handleTabChange}
				showShareTab={survey.status === "published"}
			/>

			<div className="flex items-center gap-3">
				{rightActions}
				<DropdownMenu>
					<DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
						<MoreHorizontal className="h-4 w-4" />
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>
							<Link
								href={{
									pathname: `/surveys/${survey.id}/analytics`,
								}}
								className="flex items-center"
							>
								<BarChart3 className="mr-2 h-4 w-4" />
								Analytics
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => send({ type: "TOGGLE_SETTINGS", open: true })}
						>
							<Pencil className="mr-2 h-4 w-4" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-destructive">
							Delete Survey
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{survey.status === "published" && (
					<Button
						variant="outline"
						nativeButton={false}
						render={
							<a
								href={`/s/${survey.organization?.slug}/${survey.slug}`}
								target="_blank"
								rel="noopener noreferrer"
							/>
						}
					>
						<Eye className="mr-2 h-4 w-4" />
						View Survey
					</Button>
				)}
			</div>

			<SurveySettingsDialog
				open={settingsOpen}
				onOpenChange={(open) => send({ type: "TOGGLE_SETTINGS", open })}
			/>
		</header>
	);
}
