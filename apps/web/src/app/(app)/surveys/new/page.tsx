"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

interface Organization {
	id: string;
	name: string;
	slug: string;
}

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
	organizationId: z.string(),
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
	const [organizations, setOrganizations] = useState<Organization[]>([]);
	const [selectedOrgId, setSelectedOrgId] = useState<string>("");

	const { data: session, isPending: isSessionPending } =
		authClient.useSession();

	const _orgsQuery = useQuery({
		queryKey: ["organizations"],
		queryFn: async () => {
			const result = await authClient.organization.list();
			if (result.data) {
				setOrganizations(result.data);
				// If no active organization, don't auto-select - let user choose
				if (session?.session.activeOrganizationId) {
					setSelectedOrgId(session.session.activeOrganizationId);
				}
			}
			return result.data || [];
		},
		enabled: !!session?.user,
	});

	const selectedOrg = organizations.find((org) => org.id === selectedOrgId);
	const hasActiveOrg = !!session?.session.activeOrganizationId;
	const needsOrgSelection = !hasActiveOrg && organizations.length > 0;

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
			organizationId: "",
		},
		onSubmit: async ({ value }) => {
			// If user needs to select an org, set it as active first
			if (needsOrgSelection && selectedOrgId) {
				const result = await authClient.organization.setActive({
					organizationId: selectedOrgId,
				});
				if (result.error) {
					toast.error(result.error.message || "Failed to set organization");
					return;
				}
			}

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

	// Update form value when org selection changes
	useEffect(() => {
		form.setFieldValue("organizationId", selectedOrgId);
	}, [selectedOrgId, form]);

	return (
		<div className="mx-auto w-full max-w-2xl p-6">
			<div className="mb-6">
				<Button
					variant="ghost"
					size="sm"
					nativeButton={false}
					render={<Link href="/surveys" />}
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Surveys
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
										<p className="text-destructive text-sm">
											{String(field.state.meta.errors[0])}
										</p>
									)}
								</div>
							)}
						</form.Field>

						{needsOrgSelection && (
							<div className="space-y-2">
								<Label>
									<Building2 className="mr-1 inline h-4 w-4" />
									Organization *
								</Label>
								<Select
									value={selectedOrgId}
									onValueChange={(value) => setSelectedOrgId(value || "")}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select an organization" />
									</SelectTrigger>
									<SelectContent>
										{organizations.map((org) => (
											<SelectItem key={org.id} value={org.id}>
												{org.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<p className="text-muted-foreground text-xs">
									Select which organization this survey belongs to
								</p>
							</div>
						)}

						{hasActiveOrg && selectedOrg && (
							<div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm">
								<Building2 className="h-4 w-4 text-muted-foreground" />
								<span className="text-muted-foreground">
									Creating survey for:{" "}
									<strong className="text-foreground">
										{selectedOrg.name}
									</strong>
								</span>
							</div>
						)}

						<form.Field name="slug">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>URL Slug *</Label>
									<div className="flex items-center">
										<span className="shrink-0 rounded-l-md border border-r-0 bg-muted px-3 py-2 text-muted-foreground text-sm">
											/{selectedOrg?.slug || "org"}/
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
									<p className="text-muted-foreground text-xs">
										Unique identifier for your survey URL. Use lowercase
										letters, numbers, and hyphens.
									</p>
									{field.state.meta.errors.length > 0 && (
										<p className="text-destructive text-sm">
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
										<p className="text-destructive text-sm">
											{String(field.state.meta.errors[0])}
										</p>
									)}
								</div>
							)}
						</form.Field>

						<form.Subscribe>
							{(state) => {
								const canSubmit =
									state.canSubmit &&
									!state.isSubmitting &&
									(!needsOrgSelection || selectedOrgId);

								return (
									<div className="flex gap-3 pt-4">
										<Button
											type="button"
											variant="outline"
											onClick={() => router.push("/surveys")}
										>
											Cancel
										</Button>
										<Button type="submit" disabled={!canSubmit}>
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
								);
							}}
						</form.Subscribe>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
