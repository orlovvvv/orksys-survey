"use client";

import {
	Archive,
	BarChart3,
	ClipboardList,
	Eye,
	FileText,
	MoreHorizontal,
	Settings,
	Trash2,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Status, Survey } from "./surveys-table";

interface SurveyActionsMenuProps {
	survey: Survey;
	onDelete: (id: string) => void;
	onStatusChange: (id: string, status: Status) => void;
	onEdit: (id: string) => void;
}

export function SurveyActionsMenu({
	survey,
	onDelete,
	onStatusChange,
	onEdit,
}: SurveyActionsMenuProps) {
	const isPublished = survey.status === "published";
	const hasOrganization = survey.organization !== null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button variant="ghost" size="icon">
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				}
			/>
			<DropdownMenuContent align="end">
				{/* View - only for published surveys with organization */}
				{isPublished && hasOrganization && (
					<DropdownMenuItem
						render={
							<a
								href={`/s/${survey.organization?.slug}/${survey.slug}`}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center"
							/>
						}
					>
						<Eye className="mr-2 h-4 w-4" />
						View
					</DropdownMenuItem>
				)}

				{/* Details - navigate to builder */}
				<DropdownMenuItem
					render={
						<Link
							href={`/surveys/${survey.id}`}
							className="flex items-center"
						/>
					}
				>
					<FileText className="mr-2 h-4 w-4" />
					Details
				</DropdownMenuItem>

				{/* Edit - open settings dialog */}
				<DropdownMenuItem onClick={() => onEdit(survey.id)}>
					<Settings className="mr-2 h-4 w-4" />
					Edit
				</DropdownMenuItem>

				{/* Analytics */}
				<DropdownMenuItem
					render={
						<Link
							href={`/surveys/${survey.id}/analytics`}
							className="flex items-center"
						/>
					}
				>
					<BarChart3 className="mr-2 h-4 w-4" />
					Analytics
				</DropdownMenuItem>

				{/* Status actions */}
				{survey.status === "draft" && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => onStatusChange(survey.id, "published")}
						>
							<ClipboardList className="mr-2 h-4 w-4" />
							Publish
						</DropdownMenuItem>
					</>
				)}
				{survey.status === "published" && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => onStatusChange(survey.id, "closed")}
						>
							<Archive className="mr-2 h-4 w-4" />
							Close
						</DropdownMenuItem>
					</>
				)}

				{/* Delete */}
				<DropdownMenuSeparator />
				<DropdownMenuItem
					variant="destructive"
					onClick={() => onDelete(survey.id)}
				>
					<Trash2 className="mr-2 h-4 w-4" />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
