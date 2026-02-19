"use client";

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

interface RemoveMemberDialogProps {
	memberEmail: string;
	onRemove: () => void;
	isRemoving?: boolean;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function RemoveMemberDialog({
	memberEmail,
	onRemove,
	isRemoving = false,
	open,
	onOpenChange,
}: RemoveMemberDialogProps) {
	const handleRemove = () => {
		onRemove();
		onOpenChange(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Remove Member</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to remove{" "}
						<span className="font-medium">{memberEmail}</span> from this
						organization? This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleRemove}
						disabled={isRemoving}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						{isRemoving ? "Removing..." : "Remove Member"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
