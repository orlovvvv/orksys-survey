import { ORPCError, os } from "@orpc/server";

import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o;

// Auth middleware
const requireAuth = o.middleware(async ({ context, next }) => {
	if (!context.session?.user) {
		throw new ORPCError("UNAUTHORIZED");
	}
	return next({
		context: {
			session: context.session,
		},
	});
});

export const protectedProcedure = publicProcedure.use(requireAuth);

// Organization + role middleware combined
const requireOrgWithRole = (roles: string[]) =>
	o.middleware(async ({ context, next }) => {
		if (!context.activeOrganization) {
			throw new ORPCError("FORBIDDEN", {
				message: "No active organization selected",
			});
		}
		if (!context.membership) {
			throw new ORPCError("FORBIDDEN", {
				message: "You are not a member of this organization",
			});
		}
		if (roles.length > 0 && !roles.includes(context.membership.role)) {
			throw new ORPCError("FORBIDDEN", {
				message: `This action requires one of the following roles: ${roles.join(", ")}`,
			});
		}
		return next({
			context: {
				session: context.session,
				activeOrganization: context.activeOrganization,
				membership: context.membership,
			},
		});
	});

// Procedure that requires organization membership (any role)
export const organizationProcedure = protectedProcedure.use(
	requireOrgWithRole([]),
);

// Admin procedure (owner or admin role)
export const adminProcedure = protectedProcedure.use(
	requireOrgWithRole(["owner", "admin"]),
);

// Owner procedure (owner role only)
export const ownerProcedure = protectedProcedure.use(
	requireOrgWithRole(["owner"]),
);
