"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import * as React from "react";

import { FormField } from "@/components/forms/form-field";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface DeleteOrgDialogProps {
	organizationName: string;
	memberCount: number;
	isDeleting?: boolean;
	onDelete: () => void;
}

export function DeleteOrgDialog({
	organizationName,
	memberCount,
	isDeleting = false,
	onDelete,
}: DeleteOrgDialogProps) {
	const [open, setOpen] = React.useState(false);
	const [confirmName, setConfirmName] = React.useState("");

	const canDelete = confirmName === organizationName;

	const handleDelete = () => {
		if (!canDelete) return;
		onDelete();
		setOpen(false);
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen && !isDeleting) {
			setOpen(false);
			setConfirmName("");
		} else {
			setOpen(newOpen);
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={handleOpenChange}>
			<Card className="border-destructive/50 bg-destructive/5">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-destructive">
						<AlertTriangle className="h-5 w-5" />
						Delete Organization
					</CardTitle>
					<CardDescription>
						Permanently delete this organization and all associated data
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<ul className="space-y-1 text-muted-foreground text-sm">
						<li>All members will be removed</li>
						<li>All surveys and responses will be deleted</li>
						<li>You will be redirected to create a new organization</li>
					</ul>
					<AlertDialogTrigger
						render={<Button variant="destructive">Delete Organization</Button>}
					/>
				</CardContent>
			</Card>

			<AlertDialogContent size="default">
				<AlertDialogHeader>
					<AlertDialogMedia className="bg-destructive/10 text-destructive">
						<AlertTriangle className="h-5 w-5" />
					</AlertDialogMedia>
					<AlertDialogTitle>Delete Organization</AlertDialogTitle>
					<AlertDialogDescription>
						This will permanently delete{" "}
						<span className="font-medium">{organizationName}</span>
						{memberCount > 1 && (
							<span>
								{" "}
								and remove{" "}
								<span className="font-medium">{memberCount - 1}</span> other
								member{memberCount - 1 > 1 ? "s" : ""}
							</span>
						)}
						. This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<div className="space-y-4 py-4">
					<FormField
						id="confirm-org-name"
						label={`Type "${organizationName}" to confirm`}
						type="text"
						value={confirmName}
						onChange={setConfirmName}
						placeholder={organizationName}
						required
					/>
				</div>

				<AlertDialogFooter>
					<AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						onClick={(e) => {
							e.preventDefault();
							handleDelete();
						}}
						disabled={isDeleting || !canDelete}
					>
						{isDeleting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Deleting...
							</>
						) : (
							"Delete Organization"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
