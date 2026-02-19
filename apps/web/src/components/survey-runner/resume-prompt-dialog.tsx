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

export interface ResumePromptDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onResume: () => void;
	onStartFresh: () => void;
}

/**
 * Dialog prompting users whether to resume an incomplete survey or start fresh.
 */
export function ResumePromptDialog({
	open,
	onOpenChange,
	onResume,
	onStartFresh,
}: ResumePromptDialogProps) {
	const handleResume = () => {
		onResume();
		onOpenChange(false);
	};

	const handleStartFresh = () => {
		onStartFresh();
		onOpenChange(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Continue your survey?</AlertDialogTitle>
					<AlertDialogDescription>
						You have an incomplete response for this survey. Would you like to
						continue where you left off, or start fresh?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={handleStartFresh}>
						Start Fresh
					</AlertDialogCancel>
					<AlertDialogAction onClick={handleResume}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
