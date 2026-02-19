"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface CreateOrgDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
}

export function CreateOrgDialog({
	open,
	onOpenChange,
	onSuccess,
}: CreateOrgDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create organization</DialogTitle>
					<DialogDescription>
						Add a new organization to manage your surveys.
					</DialogDescription>
				</DialogHeader>
				<CreateOrganizationForm onSuccess={onSuccess} />
			</DialogContent>
		</Dialog>
	);
}

import CreateOrganizationForm from "../onboarding/create-organization-form";
