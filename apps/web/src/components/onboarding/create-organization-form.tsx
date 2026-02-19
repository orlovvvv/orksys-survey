"use client";

import { useForm } from "@tanstack/react-form";
import z from "zod";

import { useCreateOrganization } from "@/components/organization/hooks";
import { generateSlug } from "@/utils/slug";
import { FormField } from "../forms/form-field";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface CreateOrganizationFormProps {
	onSuccess?: () => void;
}

const validateSlugLength = (name: string) => {
	const slug = generateSlug(name);
	return slug.length >= 2 && slug.length <= 50;
};

export default function CreateOrganizationForm({
	onSuccess,
}: CreateOrganizationFormProps) {
	const createOrg = useCreateOrganization();

	const form = useForm({
		defaultValues: {
			name: "",
		},
		onSubmit: async ({ value }) => {
			const slug = generateSlug(value.name);
			try {
				await createOrg.mutateAsync({ name: value.name, slug });
				onSuccess?.();
				form.reset();
			} catch (_error) {
				// Error handling is done in the hook
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
								<Label htmlFor="slug">
									Slug
									<span className="ml-2 font-normal text-muted-foreground text-xs">
										(auto-generated)
									</span>
								</Label>
								<Input
									id="slug"
									value={slug || "auto-generated-from-name"}
									readOnly
									tabIndex={-1}
									className="cursor-default bg-muted/50"
								/>
							</div>
							<Button
								type="submit"
								className="w-full"
								disabled={
									!form.state.canSubmit ||
									form.state.isSubmitting ||
									createOrg.isPending ||
									!slug
								}
							>
								{form.state.isSubmitting || createOrg.isPending
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
