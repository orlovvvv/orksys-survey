import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	json,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { organization } from "./organization";

// Survey status enum
export const surveyStatusEnum = pgEnum("survey_status", [
	"draft",
	"published",
	"closed",
	"archived",
]);

// Question type enum
export const questionTypeEnum = pgEnum("question_type", [
	"text",
	"textarea",
	"multiple_choice",
	"checkbox",
	"dropdown",
	"rating",
	"nps",
	"linear_scale",
	"date",
	"email",
	"phone",
	"file_upload",
]);

// Logic operator enum
export const logicOperatorEnum = pgEnum("logic_operator", [
	"equals",
	"not_equals",
	"contains",
	"greater_than",
	"less_than",
	"is_empty",
	"is_not_empty",
]);

// Logic action enum
export const logicActionEnum = pgEnum("logic_action", [
	"jump_to",
	"skip",
	"show",
	"hide",
	"end_survey",
]);

// Survey table
export const survey = pgTable(
	"survey",
	{
		id: text("id").primaryKey(),
		slug: text("slug").notNull(),
		title: text("title").notNull(),
		description: text("description"),
		status: surveyStatusEnum("status").default("draft").notNull(),
		settings: json("settings").$type<SurveySettings>(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		uniqueIndex("survey_slug_idx").on(table.slug),
		index("survey_organizationId_idx").on(table.organizationId),
		index("survey_userId_idx").on(table.userId),
		index("survey_status_idx").on(table.status),
	],
);

// Question table
export const question = pgTable(
	"question",
	{
		id: text("id").primaryKey(),
		surveyId: text("survey_id")
			.notNull()
			.references(() => survey.id, { onDelete: "cascade" }),
		type: questionTypeEnum("type").notNull(),
		title: text("title").notNull(),
		description: text("description"),
		config: json("config").$type<QuestionConfig>(),
		required: boolean("required").default(false).notNull(),
		order: integer("order").default(0).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("question_surveyId_idx").on(table.surveyId),
		index("question_order_idx").on(table.order),
	],
);

// Logic rule table
export const logicRule = pgTable(
	"logic_rule",
	{
		id: text("id").primaryKey(),
		surveyId: text("survey_id")
			.notNull()
			.references(() => survey.id, { onDelete: "cascade" }),
		sourceQuestionId: text("source_question_id")
			.notNull()
			.references(() => question.id, { onDelete: "cascade" }),
		operator: logicOperatorEnum("operator").notNull(),
		conditionValue: json("condition_value").$type<unknown>(),
		action: logicActionEnum("action").notNull(),
		targetQuestionId: text("target_question_id").references(() => question.id, {
			onDelete: "set null",
		}),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("logicRule_surveyId_idx").on(table.surveyId),
		index("logicRule_sourceQuestionId_idx").on(table.sourceQuestionId),
	],
);

// Response table
export const response = pgTable(
	"response",
	{
		id: text("id").primaryKey(),
		surveyId: text("survey_id")
			.notNull()
			.references(() => survey.id, { onDelete: "cascade" }),
		respondentId: text("respondent_id"),
		fingerprint: text("fingerprint"),
		metadata: json("metadata").$type<ResponseMetadata>(),
		isComplete: boolean("is_complete").default(false).notNull(),
		startedAt: timestamp("started_at").defaultNow().notNull(),
		completedAt: timestamp("completed_at"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("response_surveyId_idx").on(table.surveyId),
		index("response_fingerprint_idx").on(table.fingerprint),
		index("response_isComplete_idx").on(table.isComplete),
	],
);

// Answer table
export const answer = pgTable(
	"answer",
	{
		id: text("id").primaryKey(),
		responseId: text("response_id")
			.notNull()
			.references(() => response.id, { onDelete: "cascade" }),
		questionId: text("question_id")
			.notNull()
			.references(() => question.id, { onDelete: "cascade" }),
		value: json("value").$type<unknown>(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("answer_responseId_idx").on(table.responseId),
		index("answer_questionId_idx").on(table.questionId),
	],
);

// Relations
export const surveyRelations = relations(survey, ({ one, many }) => ({
	organization: one(organization, {
		fields: [survey.organizationId],
		references: [organization.id],
	}),
	owner: one(user, {
		fields: [survey.userId],
		references: [user.id],
	}),
	questions: many(question),
	responses: many(response),
	logicRules: many(logicRule),
}));

export const questionRelations = relations(question, ({ one, many }) => ({
	survey: one(survey, {
		fields: [question.surveyId],
		references: [survey.id],
	}),
	answers: many(answer),
	sourceLogicRules: many(logicRule, {
		relationName: "sourceQuestion",
	}),
	targetLogicRules: many(logicRule, {
		relationName: "targetQuestion",
	}),
}));

export const logicRuleRelations = relations(logicRule, ({ one }) => ({
	survey: one(survey, {
		fields: [logicRule.surveyId],
		references: [survey.id],
	}),
	sourceQuestion: one(question, {
		fields: [logicRule.sourceQuestionId],
		references: [question.id],
		relationName: "sourceQuestion",
	}),
	targetQuestion: one(question, {
		fields: [logicRule.targetQuestionId],
		references: [question.id],
		relationName: "targetQuestion",
	}),
}));

export const responseRelations = relations(response, ({ one, many }) => ({
	survey: one(survey, {
		fields: [response.surveyId],
		references: [survey.id],
	}),
	answers: many(answer),
}));

export const answerRelations = relations(answer, ({ one }) => ({
	response: one(response, {
		fields: [answer.responseId],
		references: [response.id],
	}),
	question: one(question, {
		fields: [answer.questionId],
		references: [question.id],
	}),
}));

// Type definitions for JSON fields
export interface SurveySettings {
	showProgressBar?: boolean;
	showQuestionNumbers?: boolean;
	shuffleQuestions?: boolean;
	allowMultipleResponses?: boolean;
	requireAuth?: boolean;
	collectMetadata?: boolean;
	thankYouMessage?: string;
	redirectUrl?: string;
	theme?: {
		primaryColor?: string;
		backgroundColor?: string;
		fontFamily?: string;
	};
}

export interface QuestionConfig {
	placeholder?: string;
	minLength?: number;
	maxLength?: number;
	options?: Array<{ label: string; value: string }>;
	min?: number;
	max?: number;
	step?: number;
	allowOther?: boolean;
	allowMultiple?: boolean;
	maxFiles?: number;
	maxFileSize?: number;
	acceptedFileTypes?: string[];
}

export interface ResponseMetadata {
	userAgent?: string;
	ipAddress?: string;
	referrer?: string;
	browser?: string;
	os?: string;
	device?: string;
	country?: string;
	language?: string;
	timezone?: string;
}
