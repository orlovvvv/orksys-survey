import { auth } from "@orksys-survey/auth";
import { db, eq, schema } from "@orksys-survey/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import CreateOrganizationForm from "@/components/onboarding/create-organization-form";
import SelectOrganization from "@/components/onboarding/select-organization";

const { member, organization } = schema;

export default async function OnboardingPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	if (session.session.activeOrganizationId) {
		redirect("/dashboard");
	}

	// Query user's organizations through memberships
	const memberships = await db
		.select({
			id: organization.id,
			name: organization.name,
			slug: organization.slug,
		})
		.from(member)
		.innerJoin(organization, eq(member.organizationId, organization.id))
		.where(eq(member.userId, session.user.id));

	const hasOrganizations = memberships.length > 0;

	return (
		<div className="mx-auto mt-10 w-full max-w-md p-6">
			<h1 className="mb-6 text-center font-bold text-3xl">
				{hasOrganizations ? "Select Organization" : "Create Organization"}
			</h1>
			<p className="mb-6 text-center text-muted-foreground">
				{hasOrganizations
					? "Choose an organization to continue"
					: "Create your first organization to get started"}
			</p>

			{hasOrganizations ? (
				<SelectOrganization organizations={memberships} />
			) : (
				<CreateOrganizationForm />
			)}
		</div>
	);
}
