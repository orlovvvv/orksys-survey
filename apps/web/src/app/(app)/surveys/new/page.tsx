"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { orpc } from "@/utils/orpc";

const createSurveySchema = z.object({
	slug: z
		.string()
		.min(1, "Slug is required")
		.max(100)
		.regex(
			/^[a-z0-9-]+$/,
			"Slug can only contain lowercase letters, numbers, and hyphens",
		),
	title: z.string().min(1, "Title is required").max(255),
	description: z.string().max(2000),
});

function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "")
		.slice(0, 50);
}

export default function NewSurveyPage() {
	const router = useRouter();

	const createMutation = useMutation(
		orpc.survey.create.mutationOptions({
			onSuccess: (data) => {
				toast.success("Survey created");
				router.push(`/surveys/${data.id}`);
			},
			onError: (error) => {
				toast.error(error.message || "Failed to create survey");
			},
		}),
	);

	const form = useForm({
		defaultValues: {
			slug: "",
			title: "",
			description: "",
		},
		onSubmit: async ({ value }) => {
			await createMutation.mutateAsync({
				slug: value.slug || generateSlug(value.title),
				title: value.title,
				description: value.description || undefined,
			});
		},
		validators: {
			onSubmit: createSurveySchema,
		},
	});

	return (
		<div className="mx-auto w-full max-w-2xl p-6">
			<div className="mb-6">
				<Button variant="ghost" size="sm" asChild>
					<Link href="/surveys">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Surveys
					</Link>
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Create New Survey</CardTitle>
					<CardDescription>
						Set up a new survey to start collecting responses
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="space-y-6"
					>
						<form.Field name="title">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Title *</Label>
									<Input
										id={field.name}
										name={field.name}
										placeholder="e.g., Customer Feedback Survey"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => {
											field.handleChange(e.target.value);
											// Auto-generate slug if empty
											if (!form.getFieldValue("slug")) {
												form.setFieldValue(
													"slug",
													generateSlug(e.target.value),
												);
											}
										}}
									/>
									{field.state.meta.errors.length > 0 && (
										<p className="text-red-500 text-sm">
											{String(field.state.meta.errors[0])}
										</p>
									)}
								</div>
							)}
						</form.Field>

						<form.Field name="slug">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>URL Slug *</Label>
									<div className="flex items-center">
										<span className="shrink-0 rounded-l-md border border-neutral-200 border-r-0 bg-neutral-50 px-3 py-2 text-neutral-500 text-sm">
											/survey/
										</span>
										<Input
											id={field.name}
											name={field.name}
											placeholder="customer-feedback"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											className="rounded-l-none"
										/>
									</div>
									<p className="text-neutral-500 text-xs">
										Unique identifier for your survey URL. Use lowercase
										letters, numbers, and hyphens.
									</p>
									{field.state.meta.errors.length > 0 && (
										<p className="text-red-500 text-sm">
											{String(field.state.meta.errors[0])}
										</p>
									)}
								</div>
							)}
						</form.Field>

						<form.Field name="description">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Description</Label>
									<Textarea
										id={field.name}
										name={field.name}
										placeholder="Describe the purpose of this survey..."
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										rows={3}
									/>
									{field.state.meta.errors.length > 0 && (
										<p className="text-red-500 text-sm">
											{String(field.state.meta.errors[0])}
										</p>
									)}
								</div>
							)}
						</form.Field>

						<form.Subscribe>
							{(state) => (
								<div className="flex gap-3 pt-4">
									<Button
										type="button"
										variant="outline"
										onClick={() => router.push("/surveys")}
									>
										Cancel
									</Button>
									<Button
										type="submit"
										disabled={!state.canSubmit || state.isSubmitting}
									>
										{state.isSubmitting ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Creating...
											</>
										) : (
											"Create Survey"
										)}
									</Button>
								</div>
							)}
						</form.Subscribe>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
