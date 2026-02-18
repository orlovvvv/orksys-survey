import { env } from "@orksys-survey/env/server";
import { Polar } from "@polar-sh/sdk";

// Only create Polar client if access token is configured
export const polarClient = env.POLAR_ACCESS_TOKEN
	? new Polar({
			accessToken: env.POLAR_ACCESS_TOKEN,
			server: "sandbox",
		})
	: null;
