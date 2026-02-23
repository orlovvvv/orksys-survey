import type { RouterClient } from "@orpc/server";

import { protectedProcedure, publicProcedure } from "../index";
import { analyticsRouter } from "./analytics";
import { dashboardRouter } from "./dashboard";
import { insightsRouter } from "./insights";
import { logicRuleRouter } from "./logic-rule";
import { questionRouter } from "./question";
import { responseRouter } from "./response";
import { ruleSetRouter } from "./ruleset";
import { surveyRouter } from "./survey";
import { usageRouter } from "./usage";

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
	survey: surveyRouter,
	question: questionRouter,
	ruleSet: ruleSetRouter,
	logicRule: logicRuleRouter,
	response: responseRouter,
	analytics: analyticsRouter,
	insights: insightsRouter,
	usage: usageRouter,
	dashboard: dashboardRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
