"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FormActionsProps {
	isSubmitting: boolean;
	canSubmit: boolean;
	onCancel: () => void;
}

export function FormActions({
	isSubmitting,
	canSubmit,
	onCancel,
}: FormActionsProps) {
	return (
		<div className="flex gap-3 pt-4">
			<Button type="button" variant="outline" onClick={onCancel}>
				Cancel
			</Button>
			<Button type="submit" disabled={!canSubmit}>
				{isSubmitting ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Creating...
					</>
				) : (
					"Create Survey"
				)}
			</Button>
		</div>
	);
}
