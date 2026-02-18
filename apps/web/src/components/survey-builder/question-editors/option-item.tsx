import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OptionItemProps {
	label: string;
	onChangeLabel: (label: string) => void;
	onDelete: () => void;
	canDelete: boolean;
}

export function OptionItem({
	label,
	onChangeLabel,
	onDelete,
	canDelete,
}: OptionItemProps) {
	return (
		<div className="flex items-center gap-2">
			<Input
				value={label}
				onChange={(e) => onChangeLabel(e.target.value)}
				className="flex-1"
				placeholder="Option text"
			/>
			<Button
				variant="ghost"
				size="icon"
				className="shrink-0"
				onClick={onDelete}
				disabled={!canDelete}
			>
				<Trash2 className="h-4 w-4 text-muted-foreground" />
			</Button>
		</div>
	);
}
