"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

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
			} catch (error) {
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
			<div>
				<form.Field name="name">
					{(field) => (
						<div className="space-y-2">
							<Label htmlFor={field.name}>Organization Name</Label>
							<Input
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => {
									field.handleChange(e.target.value);
									// Auto-generate slug if empty
									const slugField = field.form.getFieldValue("slug");
									if (!slugField) {
										field.form.setFieldValue(
											"slug",
											generateSlug(e.target.value),
										);
									}
								}}
								placeholder="My Organization"
							/>
							{field.state.meta.errors.map((error) => (
								<p key={error?.message} className="text-red-500 text-sm">
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>
			</div>

			<div>
				<form.Field name="slug">
					{(field) => (
						<div className="space-y-2">
							<Label htmlFor={field.name}>Slug</Label>
							<Input
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="my-organization"
							/>
							<p className="text-muted-foreground text-sm">
								Used in URLs and identifiers
							</p>
							{field.state.meta.errors.map((error) => (
								<p key={error?.message} className="text-red-500 text-sm">
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>
			</div>

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
