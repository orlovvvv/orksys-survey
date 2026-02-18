import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
	id?: string;
	label: string;
	type?: string;
	value: string | number;
	onChange: (value: string) => void;
	onBlur?: () => void;
	placeholder?: string;
	error?: string;
	hint?: string;
	required?: boolean;
	disabled?: boolean;
	className?: string;
	inputClassName?: string;
	labelClassName?: string;
}

export function FormField({
	id,
	label,
	type = "text",
	value,
	onChange,
	onBlur,
	placeholder,
	error,
	hint,
	required = false,
	disabled = false,
	className,
	inputClassName,
	labelClassName,
}: FormFieldProps) {
	const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

	return (
		<div className={cn("space-y-2", className)}>
			<Label
				htmlFor={fieldId}
				className={cn("text-xs uppercase tracking-wide", labelClassName)}
			>
				{label}
				{required && <span className="ml-1 text-destructive">*</span>}
			</Label>
			<Input
				id={fieldId}
				type={type}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onBlur={onBlur}
				placeholder={placeholder}
				disabled={disabled}
				className={cn(error && "border-destructive", inputClassName)}
			/>
			{hint && <p className="text-muted-foreground text-sm">{hint}</p>}
			{error && <p className="text-destructive text-sm">{error}</p>}
		</div>
	);
}
