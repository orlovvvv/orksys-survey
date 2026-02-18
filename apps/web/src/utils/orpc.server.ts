import "server-only";

import { createContext } from "@orksys-survey/api/context";
import { appRouter } from "@orksys-survey/api/routers/index";
import type { RouterClient } from "@orpc/server";
import { createRouterClient } from "@orpc/server";
import { headers } from "next/headers";

declare global {
	var $client: RouterClient<typeof appRouter> | undefined;
}

globalThis.$client = createRouterClient(appRouter, {
	context: async () => {
		const req = { headers: await headers() };
		return createContext(req as Parameters<typeof createContext>[0]);
	},
});
