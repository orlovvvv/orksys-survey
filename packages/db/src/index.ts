import { env } from "@orksys-survey/env/server";
import type { InferSelectModel } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";
import type {
	answer,
	logicRule,
	question,
	response,
	survey,
} from "./schema/survey";

export const db = drizzle(env.DATABASE_URL, { schema });

// Export inferred types from schema
export type Survey = InferSelectModel<typeof survey>;
export type Question = InferSelectModel<typeof question>;
export type LogicRule = InferSelectModel<typeof logicRule>;
export type Response = InferSelectModel<typeof response>;
export type Answer = InferSelectModel<typeof answer>;

// Export question types config
export * from "./question-types";

// Re-export drizzle-orm utilities
export { and, eq, or } from "drizzle-orm";
// Re-export schema for direct access
export * as schema from "./schema";
// Re-export interfaces and enums from schema
export type {
	QuestionConfig,
	ResponseMetadata,
	SurveySettings,
} from "./schema/survey";
export {
	answer,
	logicActionEnum,
	logicOperatorEnum,
	logicRule,
	question,
	questionTypeEnum,
	response,
	survey,
	surveyStatusEnum,
} from "./schema/survey";
