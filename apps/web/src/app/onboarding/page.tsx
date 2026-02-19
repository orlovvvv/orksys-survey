import { auth } from "@orksys-survey/auth";
import { db, eq, schema } from "@orksys-survey/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Logo } from "@/components/brand";
import CreateOrganizationForm from "@/components/onboarding/create-organization-form";
import { OnboardingCard } from "@/components/onboarding/onboarding-card";
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
		<div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
			<div className="w-full max-w-sm md:max-w-4xl">
				<Logo className="self-center" />
				<div className="mt-6">
					<OnboardingCard>
						<div className="flex flex-col items-center gap-2 text-center">
							<h1 className="font-bold text-2xl">
								{hasOrganizations
									? "Select Organization"
									: "Create Organization"}
							</h1>
							<p className="text-balance text-muted-foreground text-sm">
								{hasOrganizations
									? "Choose an organization to continue"
									: "Create your first organization to get started"}
							</p>
						</div>
						<div className="mt-6 flex flex-col items-center">
							{hasOrganizations ? (
								<SelectOrganization organizations={memberships} />
							) : (
								<CreateOrganizationForm />
							)}
						</div>
					</OnboardingCard>
				</div>
			</div>
		</div>
	);
}
