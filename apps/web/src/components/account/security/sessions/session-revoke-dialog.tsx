"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

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

export interface SessionRevokeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	deviceName: string;
	isRevoking: boolean;
}

export function SessionRevokeDialog({
	open,
	onOpenChange,
	onConfirm,
	deviceName,
	isRevoking,
}: SessionRevokeDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
							<AlertTriangle className="h-5 w-5 text-destructive" />
						</div>
						<div>
							<AlertDialogTitle>Revoke session?</AlertDialogTitle>
						</div>
					</div>
					<AlertDialogDescription className="mt-2">
						Are you sure you want to revoke the session for{" "}
						<span className="font-medium text-foreground">{deviceName}</span>?
						This device will be signed out immediately.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isRevoking}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						disabled={isRevoking}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						{isRevoking ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							"Revoke"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
