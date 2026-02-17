import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createEnv } from "@t3-oss/env-core";
import dotenv from "dotenv";
import { z } from "zod";

// Try multiple paths to find .env in monorepo root
const currentDir = dirname(fileURLToPath(import.meta.url));
const possiblePaths = [
	resolve(currentDir, "../../../.env"), // From packages/env/src to root
	resolve(process.cwd(), ".env"), // From current working directory
];

const envPath = possiblePaths.find((p) => existsSync(p));
if (envPath) {
	dotenv.config({ path: envPath });
}

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
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
