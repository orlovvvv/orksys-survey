"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

import { useOrgActions } from "@/components/organization-switcher/use-org-actions";
import { useOrganizations } from "@/components/organization-switcher/use-organizations";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";
import { generateSlug } from "@/utils/slug";

import { DescriptionField } from "./description-field";
import { FormActions } from "./form-actions";
import { OrganizationSelector } from "./organization-selector";
import { SlugDisplay } from "./slug-display";
import { SurveyTitleField } from "./survey-title-field";

const createSurveySchema = z.object({
	title: z.string().min(1, "Title is required").max(255),
	description: z.string().max(2000),
});

export function CreateSurveyForm() {
	const router = useRouter();
	const { data: session } = authClient.useSession();
	const { organizations } = useOrganizations({ session });
	const { switchOrganization } = useOrgActions();
	const [isSwitchingOrg, setIsSwitchingOrg] = useState(false);

	const activeOrgId = session?.session.activeOrganizationId ?? undefined;
	const activeOrg = organizations.find((org) => org.id === activeOrgId);

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
			title: "",
			description: "",
		},
		onSubmit: async ({ value }) => {
			await createMutation.mutateAsync({
				slug: generateSlug(value.title),
				title: value.title,
				description: value.description || undefined,
			});
		},
		validators: {
			onSubmit: createSurveySchema,
		},
	});

	const handleOrgChange = async (orgId: string) => {
		setIsSwitchingOrg(true);
		const success = await switchOrganization(orgId);
		setIsSwitchingOrg(false);
		if (!success) {
			toast.error("Failed to switch organization");
		}
	};

	const canSubmit =
		form.state.canSubmit &&
		!form.state.isSubmitting &&
		!isSwitchingOrg &&
		!!activeOrgId;

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-6"
		>
			<SurveyTitleField form={form} />
			<OrganizationSelector
				organizations={organizations}
				activeOrgId={activeOrgId}
				onOrgChange={handleOrgChange}
				isSwitching={isSwitchingOrg}
			/>
			<form.Subscribe selector={(state) => state.values.title}>
				{(title) => (
					<SlugDisplay
						orgSlug={activeOrg?.slug || "org"}
						surveySlug={generateSlug(title)}
					/>
				)}
			</form.Subscribe>
			<DescriptionField form={form} />
			<FormActions
				isSubmitting={form.state.isSubmitting}
				canSubmit={canSubmit}
				onCancel={() => router.push("/surveys")}
			/>
		</form>
	);
}
