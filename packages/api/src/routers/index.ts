import type { RouterClient } from "@orpc/server";

import { protectedProcedure, publicProcedure } from "../index";
import { analyticsRouter } from "./analytics";
import { insightsRouter } from "./insights";
import { logicRuleRouter } from "./logic-rule";
import { questionRouter } from "./question";
import { responseRouter } from "./response";
import { surveyRouter } from "./survey";
import { todoRouter } from "./todo";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => {
		return "OK";
	}),
	privateData: protectedProcedure.handler(({ context }) => {
		return {
			message: "This is private",
			user: context.session?.user,
		};
	}),
	todo: todoRouter,
	survey: surveyRouter,
	question: questionRouter,
	logicRule: logicRuleRouter,
	response: responseRouter,
	analytics: analyticsRouter,
	insights: insightsRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
