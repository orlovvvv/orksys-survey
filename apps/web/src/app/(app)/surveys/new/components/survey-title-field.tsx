"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SurveyTitleFieldProps {
	// biome-ignore lint/suspicious/noExplicitAny: TanStack Form types are complex
	form: any;
}

export function SurveyTitleField({ form }: SurveyTitleFieldProps) {
	return (
		<form.Field name="title">
			{(field: {
				state: { value: string; meta: { errors: unknown[] } };
				handleBlur: () => void;
				handleChange: (value: string) => void;
			}) => (
				<div className="space-y-2">
					<Label htmlFor="title">Title *</Label>
					<Input
						id="title"
						placeholder="e.g., Customer Feedback Survey"
						value={field.state.value}
						onBlur={field.handleBlur}
						onChange={(e) => field.handleChange(e.target.value)}
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
