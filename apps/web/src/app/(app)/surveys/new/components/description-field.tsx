"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionFieldProps {
	// biome-ignore lint/suspicious/noExplicitAny: TanStack Form types are complex
	form: any;
}

export function DescriptionField({ form }: DescriptionFieldProps) {
	return (
		<form.Field name="description">
			{(field: {
				state: { value: string; meta: { errors: unknown[] } };
				handleBlur: () => void;
				handleChange: (value: string) => void;
			}) => (
				<div className="space-y-2">
					<Label htmlFor="description">Description</Label>
					<Textarea
						id="description"
						placeholder="Describe the purpose of this survey..."
						value={field.state.value}
						onBlur={field.handleBlur}
						onChange={(e) => field.handleChange(e.target.value)}
						rows={3}
					/>
					{field.state.meta.errors.length > 0 && (
						<p className="text-destructive text-sm">
							{String(field.state.meta.errors[0])}
						</p>
					)}
				</div>
			)}
		</form.Field>
	);
}
