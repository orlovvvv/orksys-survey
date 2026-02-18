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
		<div className="flex items-center justify-between">
			<div className="space-y-0.5">
				<Label htmlFor={id}>{label}</Label>
				{description && (
					<p className="text-muted-foreground text-xs">{description}</p>
				)}
			</div>
			<Switch
				id={id}
				checked={checked ?? false}
				onCheckedChange={onChange}
			/>
		</div>
	);
}
