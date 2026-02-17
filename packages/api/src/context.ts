import { auth } from "@orksys-survey/auth";
import { db } from "@orksys-survey/db";
import { member, organization } from "@orksys-survey/db/schema/organization";
import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

export interface ActiveOrganization {
	id: string;
	name: string;
	slug: string;
	logo: string | null;
}

export interface Membership {
	id: string;
	role: "owner" | "admin" | "member";
	organizationId: string;
}

export async function createContext(req: NextRequest) {
	const session = await auth.api.getSession({
		headers: req.headers,
	});

	if (!session?.user) {
		return {
			session: null,
			activeOrganization: null,
			membership: null,
		};
	}

	// Get active organization ID from session
	const activeOrgId = session.session.activeOrganizationId;

	if (!activeOrgId) {
		return {
			session,
			activeOrganization: null,
			membership: null,
		};
	}

	// Fetch organization and membership in parallel
	const [org, membershipRecord] = await Promise.all([
		db
			.select({
				id: organization.id,
				name: organization.name,
				slug: organization.slug,
				logo: organization.logo,
			})
			.from(organization)
			.where(eq(organization.id, activeOrgId))
			.limit(1)
			.then((rows) => rows[0] ?? null),
		db
			.select({
				id: member.id,
				role: member.role,
				organizationId: member.organizationId,
			})
			.from(member)
			.where(
				and(
					eq(member.userId, session.user.id),
					eq(member.organizationId, activeOrgId),
				),
			)
			.limit(1)
			.then((rows) => rows[0] ?? null),
	]);

	return {
		session,
		activeOrganization: org as ActiveOrganization | null,
		membership: membershipRecord as Membership | null,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
