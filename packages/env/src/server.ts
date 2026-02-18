import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
		POLAR_ACCESS_TOKEN: z.string().optional(),
		POLAR_SUCCESS_URL: z.url(),
		CORS_ORIGIN: z.url(),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		// Groq AI Integration
		GROQ_API_KEY: z.string().min(1).optional(),
		GROQ_MODEL: z.string().default("llama-3.3-70b-versatile"),
		// Email (Resend)
		RESEND_API_KEY: z.string().min(1).optional(),
		EMAIL_FROM: z.string().default("noreply@example.com"),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
