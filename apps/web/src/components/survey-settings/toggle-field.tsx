import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export interface ToggleFieldProps {
	id: string;
	label: string;
	checked: boolean | undefined;
	onChange: (checked: boolean) => void;
	description?: string;
}

export function ToggleField({
	id,
	label,
	checked,
	onChange,
	description,
}: ToggleFieldProps) {
	return (
		<Label
			htmlFor={id}
			className="flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
		>
			<div className="space-y-0.5">
				<span className="font-medium">{label}</span>
				{description && (
					<p className="text-muted-foreground text-xs">{description}</p>
				)}
			</div>
			<Switch id={id} checked={checked ?? false} onCheckedChange={onChange} />
		</Label>
	);
}
