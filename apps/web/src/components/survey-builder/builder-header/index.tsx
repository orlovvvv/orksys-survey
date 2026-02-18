"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	ArrowLeft,
	BarChart3,
	Eye,
	Loader2,
	MoreHorizontal,
	Send,
	Settings,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { orpc } from "@/utils/orpc";
import { useSurveyBuilder } from "../context";
import { SurveySettingsDialog } from "../survey-settings-dialog";
import { BuilderTabs } from "./builder-tabs";

const statusColors: Record<string, string> = {
	draft: "bg-neutral-100 text-neutral-600",
	published: "bg-green-100 text-green-700",
	closed: "bg-orange-100 text-orange-700",
	archived: "bg-neutral-100 text-neutral-500",
};

interface BuilderHeaderProps {
	leftActions?: React.ReactNode;
	rightActions?: React.ReactNode;
}

export function BuilderHeader({
	leftActions,
	rightActions,
}: BuilderHeaderProps) {
	const { survey, activeTab, setActiveTab, settingsOpen, setSettingsOpen } =
		useSurveyBuilder();
	const queryClient = useQueryClient();

	const publishMutation = useMutation(
		orpc.survey.changeStatus.mutationOptions({
			onSuccess: () => {
				toast.success("Survey published!");
				queryClient.invalidateQueries({ queryKey: ["survey"] });
			},
			onError: (error) => {
				toast.error(error.message || "Failed to publish survey");
			},
		}),
	);

	const handlePublish = () => {
		if (survey.status === "draft") {
			publishMutation.mutate({ id: survey.id, status: "published" });
		}
	};

	const handleTabChange = (tab: "build" | "preview" | "share") => {
		setActiveTab(tab);
	};

	return (
		<header className="z-20 flex shrink-0 items-center justify-between border-neutral-100 border-b bg-white px-6 py-3">
			<div className="flex items-center gap-4">
				{leftActions}
				<Button variant="ghost" size="sm" asChild>
					<Link href="/surveys">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Link>
				</Button>
				<div className="flex items-center gap-2 font-sans font-semibold text-neutral-900 text-sm">
					<span className="text-neutral-400">Surveys /</span>
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
						<DropdownMenuItem onClick={() => setSettingsOpen(true)}>
							<Settings className="mr-2 h-4 w-4" />
							Survey Settings
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-red-600">
							Delete Survey
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{survey.status === "draft" ? (
					<Button onClick={handlePublish} disabled={publishMutation.isPending}>
						{publishMutation.isPending ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<Send className="mr-2 h-4 w-4" />
						)}
						Publish
					</Button>
				) : (
					<Button variant="outline" asChild>
						<a
							href={`/s/${survey.slug}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Eye className="mr-2 h-4 w-4" />
							View Survey
						</a>
					</Button>
				)}
			</div>

			<SurveySettingsDialog
				open={settingsOpen}
				onOpenChange={setSettingsOpen}
			/>
		</header>
	);
}
