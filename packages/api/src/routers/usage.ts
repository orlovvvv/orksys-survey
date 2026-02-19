import { db } from "@orksys-survey/db";
import { response, survey } from "@orksys-survey/db/schema/survey";
import { and, count, eq, gte } from "drizzle-orm";
import { organizationProcedure } from "../index";

export const usageRouter = {
	// Get usage stats for the current organization
	getStats: organizationProcedure.handler(async ({ context }) => {
		const organizationId = context.activeOrganization.id;

		// Count total surveys for the organization
		const [surveyCountResult] = await db
			.select({ count: count() })
			.from(survey)
			.where(eq(survey.organizationId, organizationId));

		const surveysCount = surveyCountResult?.count ?? 0;

		// Count responses created this month for the organization
		const startOfMonth = new Date();
		startOfMonth.setDate(1);
		startOfMonth.setHours(0, 0, 0, 0);

		let responsesThisMonth = 0;

		// Count responses from this month for surveys in this organization
		const responsesCount = await db
			.select({ count: count() })
			.from(response)
			.innerJoin(survey, eq(response.surveyId, survey.id))
			.where(
				and(
					eq(survey.organizationId, organizationId),
					gte(response.createdAt, startOfMonth),
				),
			);

		responsesThisMonth = responsesCount[0]?.count ?? 0;

		return {
			surveysCount,
			responsesThisMonth,
		};
	}),
};

export type UsageStats = {
	surveysCount: number;
	responsesThisMonth: number;
};
