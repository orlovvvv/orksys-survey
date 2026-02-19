"use client";

import { motion } from "framer-motion";
import {
	Archive,
	ClipboardList,
	FileX,
	Layers,
	Loader2,
	Trash2,
	X,
} from "lucide-react";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Status = "draft" | "published" | "closed" | "archived";

export interface SurveysSelectionBarProps {
	selectedCount: number;
	onClear: () => void;
	onBulkDelete: () => void;
	onBulkStatusChange: (status: Status) => void;
	isLoading?: boolean;
}

const statusOptions: Array<{
	value: Status;
	label: string;
	icon: React.ElementType;
}> = [
	{ value: "draft", label: "Draft", icon: FileX },
	{ value: "published", label: "Published", icon: ClipboardList },
	{ value: "closed", label: "Closed", icon: Layers },
	{ value: "archived", label: "Archived", icon: Archive },
];

// Spring preset for UI elements
const springTransition = {
	type: "spring" as const,
	stiffness: 400,
	damping: 30,
	mass: 0.8,
};

export function SurveysSelectionBar({
	selectedCount,
	onClear,
	onBulkDelete,
	onBulkStatusChange,
	isLoading = false,
}: SurveysSelectionBarProps) {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const handleDeleteConfirm = () => {
		onBulkDelete();
		setDeleteDialogOpen(false);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 80, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: 80, scale: 0.95 }}
			transition={springTransition}
			className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2"
		>
			<div className="flex items-center gap-3 rounded-xl border bg-background/95 px-4 py-3 shadow-lg backdrop-blur-sm">
				<div className="flex items-center gap-2">
					<Badge variant="secondary" className="tabular-nums">
						{selectedCount}
					</Badge>
					<span className="text-sm">
						survey{selectedCount !== 1 ? "s" : ""} selected
					</span>
				</div>
				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button variant="outline" size="sm" disabled={isLoading}>
									{isLoading ? (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									) : (
										<Archive className="mr-2 h-4 w-4" />
									)}
									Change Status
								</Button>
							}
						/>
						<DropdownMenuContent align="end">
							{statusOptions.map(({ value, label, icon: Icon }) => (
								<DropdownMenuItem
									key={value}
									onClick={() => onBulkStatusChange(value)}
									disabled={isLoading}
								>
									<Icon className="mr-2 h-4 w-4" />
									{label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
					<AlertDialog
						open={deleteDialogOpen}
						onOpenChange={setDeleteDialogOpen}
					>
						<AlertDialogTrigger
							render={
								<Button variant="destructive" size="sm" disabled={isLoading}>
									{isLoading ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Trash2 className="h-4 w-4" />
									)}
									<span className="hidden sm:inline">Delete</span>
								</Button>
							}
						/>
						<AlertDialogContent size="sm">
							<AlertDialogHeader>
								<AlertDialogTitle>Delete Selected Surveys</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to delete {selectedCount} survey
									{selectedCount !== 1 ? "s" : ""}? This action cannot be
									undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel disabled={isLoading}>
									Cancel
								</AlertDialogCancel>
								<AlertDialogAction
									variant="destructive"
									onClick={handleDeleteConfirm}
									disabled={isLoading}
								>
									{isLoading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Deleting...
										</>
									) : (
										"Delete"
									)}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
					<Button
						variant="ghost"
						size="sm"
						onClick={onClear}
						disabled={isLoading}
						className="gap-1.5"
					>
						<X className="h-4 w-4" />
						<span className="hidden sm:inline">Clear</span>
					</Button>
				</div>
			</div>
		</motion.div>
	);
}
