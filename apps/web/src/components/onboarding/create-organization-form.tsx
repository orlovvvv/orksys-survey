"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import { FormField } from "../forms/form-field";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface CreateOrganizationFormProps {
	onSuccess?: () => void;
}

const generateSlug = (name: string) => {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
};

const validateSlugLength = (name: string) => {
	const slug = generateSlug(name);
	return slug.length >= 2 && slug.length <= 50;
};

export default function CreateOrganizationForm({
	onSuccess,
}: CreateOrganizationFormProps) {
	const router = useRouter();

	const form = useForm({
		defaultValues: {
			name: "",
		},
		onSubmit: async ({ value }) => {
			const slug = generateSlug(value.name);
			try {
				const result = await authClient.organization.create({
					name: value.name,
					slug,
				});

				if (result.error) {
					toast.error(result.error.message || "Failed to create organization");
					return;
				}

				if (result.data?.id) {
					await authClient.organization.setActive({
						organizationId: result.data.id,
					});
				}

				toast.success("Organization created successfully");
				onSuccess?.();
				form.reset();
				router.refresh();
			} catch (_error) {
				toast.error("An unexpected error occurred");
			}
		},
		validators: {
			onSubmit: z.object({
				name: z
					.string()
					.min(2, "Name must be at least 2 characters")
					.max(100, "Name must be at most 100 characters")
					.refine(
						validateSlugLength,
						"Name must generate a valid slug between 2-50 characters",
					),
			}),
		},
	});

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
						onChange={field.handleChange}
						onBlur={field.handleBlur}
						error={field.state.meta.errors[0]?.message}
						placeholder="My Organization"
					/>
				)}
			</form.Field>

			<form.Subscribe selector={(state) => state.values.name}>
				{(nameValue) => {
					const slug = generateSlug(nameValue);
					return (
						<>
							<div className="space-y-2">
								<Label htmlFor="slug">Slug</Label>
								<Input
									id="slug"
									value={slug}
									disabled
									placeholder="auto-generated-from-name"
									className="bg-muted"
								/>
								<p className="text-muted-foreground text-sm">
									Used in URLs and identifiers
								</p>
							</div>
							<Button
								type="submit"
								className="w-full"
								disabled={
									!form.state.canSubmit || form.state.isSubmitting || !slug
								}
							>
								{form.state.isSubmitting
									? "Creating..."
									: "Create Organization"}
							</Button>
						</>
					);
				}}
			</form.Subscribe>
		</form>
	);
}
