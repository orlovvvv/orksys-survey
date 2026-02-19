"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	Archive,
	BarChart3,
	Calendar,
	ClipboardList,
	Columns3,
	Edit,
	Loader2,
	MoreHorizontal,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const statusColors = {
	draft: "bg-muted text-muted-foreground",
	published:
		"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
	closed:
		"bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
	archived: "bg-muted text-muted-foreground",
};

// Stagger delay per item
const staggerDelay = 0.02;

export type Survey = {
	id: string;
	title: string;
	slug: string;
	description: string | null;
	status: "draft" | "published" | "closed" | "archived";
	createdAt: Date;
	owner: {
		id: string;
		name: string | null;
		email: string;
		image: string | null;
	} | null;
	organization: {
		id: string;
		name: string;
		slug: string;
		logo: string | null;
	} | null;
};

export type Status = "draft" | "published" | "closed" | "archived";

export interface SurveysTableProps {
	surveys: Survey[];
	isLoading: boolean;
	onDelete: (id: string) => void;
	onStatusChange: (id: string, status: Status) => void;
	selectedIds: Set<string>;
	onSelectionChange: (ids: Set<string>) => void;
	onBulkDelete: (ids: string[]) => void;
	onBulkStatusChange: (ids: string[], status: Status) => void;
}

function getInitials(name: string | null): string {
	if (!name) return "??";
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

interface SurveyActionsProps {
	survey: Survey;
	onDelete: (id: string) => void;
	onStatusChange: (id: string, status: Status) => void;
}

function SurveyActions({
	survey,
	onDelete,
	onStatusChange,
}: SurveyActionsProps) {
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
				<DropdownMenuItem
					render={
						<Link
							href={`/surveys/${survey.id}`}
							className="flex items-center"
						/>
					}
				>
					<Edit className="mr-2 h-4 w-4" />
					Edit
				</DropdownMenuItem>
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

export function SurveysTable({
	surveys,
	isLoading,
	onDelete,
	onStatusChange,
	selectedIds,
	onSelectionChange,
}: Omit<SurveysTableProps, "onBulkDelete" | "onBulkStatusChange">) {
	const [visibleColumns, setVisibleColumns] = useState({
		slug: true,
		created: true,
		owner: true,
	});

	const allSelected =
		surveys.length > 0 && surveys.every((s) => selectedIds.has(s.id));
	const someSelected =
		surveys.length > 0 && surveys.some((s) => selectedIds.has(s.id));

	// Checkbox shows checked if all are selected, unchecked if none are selected
	// Indeterminate is handled visually via data attribute
	const headerChecked = !!allSelected;
	const headerIndeterminate = someSelected && !allSelected;

	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			const newSelection = new Set(selectedIds);
			for (const s of surveys) {
				newSelection.add(s.id);
			}
			onSelectionChange(newSelection);
		} else {
			const newSelection = new Set(selectedIds);
			for (const s of surveys) {
				newSelection.delete(s.id);
			}
			onSelectionChange(newSelection);
		}
	};

	const handleSelectRow = (id: string, checked: boolean) => {
		const newSelection = new Set(selectedIds);
		if (checked) {
			newSelection.add(id);
		} else {
			newSelection.delete(id);
		}
		onSelectionChange(newSelection);
	};

	if (isLoading) {
		return (
			<div className="flex min-h-[300px] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (surveys.length === 0) {
		return null;
	}

	return (
		<div className="pb-20">
			<div className="flex items-center justify-between border-b px-4 py-3">
				<span className="text-muted-foreground text-sm">
					{surveys.length} survey{surveys.length !== 1 ? "s" : ""}
				</span>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<Button variant="outline" size="sm">
								<Columns3 className="mr-2 h-4 w-4" />
								Columns
							</Button>
						}
					/>
					<DropdownMenuContent align="end">
						<DropdownMenuCheckboxItem
							checked={visibleColumns.slug}
							onCheckedChange={(checked) =>
								setVisibleColumns((prev) => ({ ...prev, slug: !!checked }))
							}
						>
							Slug
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={visibleColumns.created}
							onCheckedChange={(checked) =>
								setVisibleColumns((prev) => ({ ...prev, created: !!checked }))
							}
						>
							Created
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={visibleColumns.owner}
							onCheckedChange={(checked) =>
								setVisibleColumns((prev) => ({ ...prev, owner: !!checked }))
							}
						>
							Owner
						</DropdownMenuCheckboxItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[40px]">
							<Checkbox
								checked={headerChecked}
								onCheckedChange={(value: unknown) =>
									handleSelectAll(value === true)
								}
								aria-label="Select all"
								className={headerIndeterminate ? "opacity-50" : undefined}
							/>
						</TableHead>
						<TableHead>Survey</TableHead>
						<TableHead>Status</TableHead>
						<TableHead
							className={`hidden sm:table-cell ${!visibleColumns.slug ? "!hidden" : ""}`}
						>
							Slug
						</TableHead>
						<TableHead
							className={`hidden md:table-cell ${!visibleColumns.created ? "!hidden" : ""}`}
						>
							Created
						</TableHead>
						<TableHead
							className={`hidden lg:table-cell ${!visibleColumns.owner ? "!hidden" : ""}`}
						>
							Owner
						</TableHead>
						<TableHead className="w-[70px]" />
					</TableRow>
				</TableHeader>
				<TableBody>
					<AnimatePresence mode="popLayout" initial={false}>
						{surveys.map((survey, index) => (
							<motion.tr
								key={survey.id}
								layout
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{ duration: 0.15, delay: index * staggerDelay }}
								data-selected={selectedIds.has(survey.id)}
								className="border-b transition-colors hover:bg-muted/50 data-[selected=true]:bg-muted/50 data-[state=selected]:bg-muted"
							>
								<TableCell>
									<Checkbox
										checked={selectedIds.has(survey.id)}
										onCheckedChange={(value: unknown) =>
											handleSelectRow(survey.id, value === true)
										}
										aria-label={`Select ${survey.title}`}
									/>
								</TableCell>
								<TableCell>
									<div className="flex flex-col gap-1">
										<Link
											href={`/surveys/${survey.id}`}
											className="font-medium hover:text-primary"
										>
											{survey.title}
										</Link>
										{survey.description && (
											<span className="line-clamp-1 text-muted-foreground text-xs">
												{survey.description}
											</span>
										)}
									</div>
								</TableCell>
								<TableCell>
									<Badge
										variant="secondary"
										className={statusColors[survey.status]}
									>
										{survey.status}
									</Badge>
								</TableCell>
								<TableCell
									className={`hidden sm:table-cell ${!visibleColumns.slug ? "!hidden" : ""}`}
								>
									<span className="text-muted-foreground text-sm">
										/{survey.slug}
									</span>
								</TableCell>
								<TableCell
									className={`hidden md:table-cell ${!visibleColumns.created ? "!hidden" : ""}`}
								>
									<div className="flex items-center gap-1.5 text-muted-foreground text-sm">
										<Calendar className="h-3.5 w-3.5" />
										{new Date(survey.createdAt).toLocaleDateString()}
									</div>
								</TableCell>
								<TableCell
									className={`hidden lg:table-cell ${!visibleColumns.owner ? "!hidden" : ""}`}
								>
									{survey.owner ? (
										<div className="flex items-center gap-2">
											<Avatar size="sm">
												<AvatarImage
													src={survey.owner.image || undefined}
													alt={survey.owner.name || ""}
												/>
												<AvatarFallback>
													{getInitials(survey.owner.name)}
												</AvatarFallback>
											</Avatar>
											<span className="text-sm">
												{survey.owner.name ?? survey.owner.email}
											</span>
										</div>
									) : (
										<span className="text-muted-foreground text-sm">—</span>
									)}
								</TableCell>
								<TableCell>
									<SurveyActions
										survey={survey}
										onDelete={onDelete}
										onStatusChange={onStatusChange}
									/>
								</TableCell>
							</motion.tr>
						))}
					</AnimatePresence>
				</TableBody>
			</Table>
		</div>
	);
}
