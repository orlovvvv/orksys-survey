import { expo } from "@better-auth/expo";
import { db } from "@orksys-survey/db";
import * as authSchema from "@orksys-survey/db/schema/auth";
import * as organizationSchema from "@orksys-survey/db/schema/organization";
import { env } from "@orksys-survey/env/server";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";

import { polarClient } from "./lib/payments";
import { ac, admin, member, owner } from "./permissions";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			...authSchema,
			...organizationSchema,
		},
	}),
	trustedOrigins: [
		env.CORS_ORIGIN,
		"mybettertapp://",
		...(env.NODE_ENV === "development"
			? [
					"exp://",
					"exp://**",
					"exp://192.168.*.*:*/**",
					"http://localhost:8081",
				]
			: []),
	],
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		organization({
			ac,
			roles: {
				member,
				admin,
				owner,
			},
			allowUserToCreateOrganization: true,
			membershipLimit: 100,
			invitationExpiresIn: 60 * 60 * 24 * 7, // 7 days
		}),
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			enableCustomerPortal: true,
			use: [
				checkout({
					products: [
						{
							productId: "your-product-id",
							slug: "pro",
						},
					],
					successUrl: env.POLAR_SUCCESS_URL,
					authenticatedUsersOnly: true,
				}),
				portal(),
			],
		}),
		nextCookies(),
		expo(),
	],
});
