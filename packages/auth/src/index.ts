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
import { Resend } from "resend";

import { polarClient } from "./lib/payments";
import { ac, admin, member, owner } from "./permissions";

// Initialize Resend client if API key is configured
const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

// Email sending helper (void to avoid timing attacks)
function sendEmail({
	to,
	subject,
	html,
}: {
	to: string;
	subject: string;
	html: string;
}) {
	if (!resend) {
		console.warn("Email not sent: RESEND_API_KEY not configured");
		return;
	}
	void resend.emails.send({
		from: env.EMAIL_FROM,
		to,
		subject,
		html,
	});
}

// Only include Polar plugin if access token is configured and client exists
const polarPlugin =
	env.POLAR_ACCESS_TOKEN && polarClient
		? [
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
			]
		: [];

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
		requireEmailVerification: false,
		// Send password reset email
		...(resend
			? {
					async sendResetPassword({ user, url }) {
						sendEmail({
							to: user.email,
							subject: "Reset your password",
							html: `Click <a href="${url}">here</a> to reset your password.`,
						});
					},
				}
			: {}),
	},
	// Email verification configuration
	...(resend
		? {
				emailVerification: {
					async sendVerificationEmail({ user, url }) {
						sendEmail({
							to: user.email,
							subject: "Verify your email address",
							html: `Click <a href="${url}">here</a> to verify your email address.`,
						});
					},
				},
			}
		: {}),
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
		...polarPlugin,
		nextCookies(),
		expo(),
	],
});
