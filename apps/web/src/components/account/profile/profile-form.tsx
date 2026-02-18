"use client";

import { useForm } from "@tanstack/react-form";
import * as React from "react";
import { z } from "zod";

import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { useProfileUpdate } from "../hooks";

export interface ProfileFormProps {
	initialName: string;
	email: string;
	isLoading?: boolean;
	onSuccess?: () => void;
}

export function ProfileForm({
	initialName,
	email,
	isLoading = false,
	onSuccess,
}: ProfileFormProps) {
	const profileMutation = useProfileUpdate();
	const [localName, setLocalName] = React.useState(initialName);

	const form = useForm({
		defaultValues: {
			name: initialName,
		},
		onSubmit: async ({ value }) => {
			await profileMutation.mutateAsync({ name: value.name });
			setLocalName(value.name);
			onSuccess?.();
		},
		validators: {
			onSubmit: z.object({
				name: z
					.string()
					.min(1, "Name is required")
					.max(100, "Name must be less than 100 characters"),
			}),
		},
	});

	// Update local state when initialName changes
	React.useEffect(() => {
		setLocalName(initialName);
		form.setFieldValue("name", initialName);
	}, [initialName, form]);

	const isSubmitting = profileMutation.isPending;

	if (isLoading) {
		return (
			<div className="flex min-h-[200px] items-center justify-center">
				<Spinner />
			</div>
		);
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-6"
		>
			<form.Field name="name">
				{(field) => (
					<FormField
						label="Name"
						type="text"
						value={field.state.value}
						onChange={field.handleChange}
						onBlur={field.handleBlur}
						error={field.state.meta.errors[0]?.message}
						placeholder="Your name"
					/>
				)}
			</form.Field>

			<FormField
				label="Email"
				type="email"
				value={email}
				onChange={() => {}}
				disabled
				hint="Contact support to change your email address"
			/>

			<form.Subscribe>
				{(state) => (
					<div className="flex justify-end">
						<Button
							type="submit"
							disabled={
								!state.canSubmit ||
								state.isSubmitting ||
								localName === state.values.name
							}
						>
							{isSubmitting ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				)}
			</form.Subscribe>
		</form>
	);
}
