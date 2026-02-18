"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import { FormField } from "../forms/form-field";
import { Button } from "../ui/button";

export default function CreateOrganizationForm() {
	const router = useRouter();

	const form = useForm({
		defaultValues: {
			name: "",
			slug: "",
		},
		onSubmit: async ({ value }) => {
			try {
				const result = await authClient.organization.create({
					name: value.name,
					slug: value.slug,
				});

				if (result.error) {
					toast.error(result.error.message || "Failed to create organization");
					return;
				}

				// Set the newly created organization as active
				if (result.data?.id) {
					await authClient.organization.setActive({
						organizationId: result.data.id,
					});
				}

				toast.success("Organization created successfully");
				router.push("/dashboard");
				router.refresh();
			} catch (_error) {
				toast.error("An unexpected error occurred");
			}
		},
		validators: {
			onSubmit: z.object({
				name: z.string().min(2, "Name must be at least 2 characters"),
				slug: z
					.string()
					.min(2, "Slug must be at least 2 characters")
					.max(50, "Slug must be at most 50 characters")
					.regex(
						/^[a-z0-9-]+$/,
						"Slug can only contain lowercase letters, numbers, and hyphens",
					),
			}),
		},
	});

	// Auto-generate slug from name
	const generateSlug = (name: string) => {
		return name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-4"
		>
			<form.Field name="name">
				{(field) => (
					<FormField
						label="Organization Name"
						value={field.state.value}
						onChange={(value) => {
							field.handleChange(value);
							// Auto-generate slug if empty
							const slugField = field.form.getFieldValue("slug");
							if (!slugField) {
								field.form.setFieldValue("slug", generateSlug(value));
							}
						}}
						onBlur={field.handleBlur}
						error={field.state.meta.errors[0]?.message}
						placeholder="My Organization"
					/>
				)}
			</form.Field>

			<form.Field name="slug">
				{(field) => (
					<FormField
						label="Slug"
						value={field.state.value}
						onChange={field.handleChange}
						onBlur={field.handleBlur}
						error={field.state.meta.errors[0]?.message}
						hint="Used in URLs and identifiers"
						placeholder="my-organization"
					/>
				)}
			</form.Field>

			<form.Subscribe>
				{(state) => (
					<Button
						type="submit"
						className="w-full"
						disabled={!state.canSubmit || state.isSubmitting}
					>
						{state.isSubmitting ? "Creating..." : "Create Organization"}
					</Button>
				)}
			</form.Subscribe>
		</form>
	);
}
