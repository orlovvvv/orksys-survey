"use client";

import { LogOut } from "lucide-react";
import * as React from "react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface LeaveOrgDialogProps {
	organizationName: string;
	isOnlyOwner: boolean;
	onLeave: () => void;
	isLeaving?: boolean;
}

export function LeaveOrgDialog({
	organizationName,
	isOnlyOwner,
	onLeave,
	isLeaving = false,
}: LeaveOrgDialogProps) {
	const [open, setOpen] = React.useState(false);

	const handleLeave = () => {
		onLeave();
		setOpen(false);
	};

	if (isOnlyOwner) {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger
						render={
							<Button variant="outline" disabled className="w-full sm:w-auto">
								<LogOut className="mr-2 h-4 w-4" />
								Leave Organization
							</Button>
						}
					/>
					<TooltipContent>
						<p>You cannot leave as the only owner.</p>
						<p>Transfer ownership to another member first.</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	return (
		<>
			<Button
				variant="outline"
				onClick={() => setOpen(true)}
				className="w-full sm:w-auto"
			>
				<LogOut className="mr-2 h-4 w-4" />
				Leave Organization
			</Button>

			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Leave Organization</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to leave{" "}
							<span className="font-medium">{organizationName}</span>? You will
							lose access to all shared resources, surveys, and data. This
							action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleLeave}
							disabled={isLeaving}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isLeaving ? "Leaving..." : "Leave Organization"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
