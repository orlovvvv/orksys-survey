import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

const currentDir = dirname(fileURLToPath(import.meta.url));
const possiblePaths = [
	resolve(currentDir, "../../.env"),
	resolve(process.cwd(), ".env"),
];

const envPath = possiblePaths.find((p) => existsSync(p));
if (envPath) {
	dotenv.config({ path: envPath });
}

export default defineConfig({
	schema: "./src/schema",
	out: "./src/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL || "",
	},
});
