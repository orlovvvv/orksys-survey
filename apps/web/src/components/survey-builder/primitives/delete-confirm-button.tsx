"use client";

import { Trash2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DeleteConfirmButtonProps {
	onDelete: () => void;
	isDeleting?: boolean;
	className?: string;
}

export function DeleteConfirmButton({
	onDelete,
	isDeleting = false,
	className,
}: DeleteConfirmButtonProps) {
	const [showConfirm, setShowConfirm] = useState(false);

	if (showConfirm) {
		return (
			<div className={cn("flex shrink-0 items-center gap-1", className)}>
				<Button
					variant="ghost"
					size="icon"
					className="h-7 w-7"
					onClick={() => setShowConfirm(false)}
				>
					<X className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
					onClick={() => {
						onDelete();
						setShowConfirm(false);
					}}
					disabled={isDeleting}
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			</div>
		);
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			className={cn("h-7 w-7 shrink-0", className)}
			onClick={() => setShowConfirm(true)}
		>
			<Trash2 className="h-4 w-4" />
		</Button>
	);
}
