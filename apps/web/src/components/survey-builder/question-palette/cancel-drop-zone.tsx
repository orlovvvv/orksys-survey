import { useDroppable } from "@dnd-kit/core";
import { Trash2 } from "lucide-react";

export function CancelDropZone() {
	const { setNodeRef, isOver } = useDroppable({
		id: "palette-cancel-zone",
	});

	if (!isOver) return null;

	return (
		<div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-destructive/10 text-destructive backdrop-blur-sm">
			<Trash2 className="mb-2 h-8 w-8" />
			<p className="font-semibold text-sm">Drop to Cancel</p>
		</div>
	);
}
