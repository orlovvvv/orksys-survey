"use client";

import { Crown } from "lucide-react";

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

interface TransferOwnershipDialogProps {
	newOwnerName: string;
	newOwnerEmail: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onTransfer: () => void;
	isTransferring?: boolean;
}

export function TransferOwnershipDialog({
	newOwnerName,
	newOwnerEmail,
	open,
	onOpenChange,
	onTransfer,
	isTransferring = false,
}: TransferOwnershipDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
						<Crown className="h-6 w-6 text-amber-600 dark:text-amber-400" />
					</div>
					<AlertDialogTitle className="text-center">
						Transfer Ownership
					</AlertDialogTitle>
					<AlertDialogDescription className="text-center">
						Are you sure you want to transfer ownership to{" "}
						<span className="font-medium">{newOwnerName}</span> (
						<span className="font-medium">{newOwnerEmail}</span>)?{" "}
						<span className="mt-3 block text-muted-foreground">
							You will become an <span className="font-medium">admin</span> and
							can be removed from the organization by the new owner. This action
							cannot be easily undone.
						</span>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isTransferring}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onTransfer}
						disabled={isTransferring}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						{isTransferring ? "Transferring..." : "Transfer Ownership"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
