import { relations } from "drizzle-orm";
import {
	index,
	integer,
	json,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { survey } from "./survey";

// Analytics snapshot types
export type AnalyticsType = "summary" | "question" | "trends" | "demographics";

// Analytics snapshot table - Pre-computed analytics with TTL
export const analyticsSnapshot = pgTable(
	"analytics_snapshot",
	{
		id: text("id").primaryKey(),
		surveyId: text("survey_id")
			.notNull()
			.references(() => survey.id, { onDelete: "cascade" }),
		type: text("type").$type<AnalyticsType>().notNull(), // summary, question, trends, demographics
		questionId: text("question_id"), // For question-specific analytics
		data: json("data").$type<unknown>().notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("analyticsSnapshot_surveyId_idx").on(table.surveyId),
		index("analyticsSnapshot_type_idx").on(table.type),
		index("analyticsSnapshot_expiresAt_idx").on(table.expiresAt),
		index("analyticsSnapshot_surveyId_type_idx").on(table.surveyId, table.type),
	],
);

// AI analysis types
export type AnalysisType = "text_summary" | "sentiment" | "keywords";

// AI Analysis table - LLM-generated insights with TTL
export const aiAnalysis = pgTable(
	"ai_analysis",
	{
		id: text("id").primaryKey(),
		surveyId: text("survey_id")
			.notNull()
			.references(() => survey.id, { onDelete: "cascade" }),
		questionId: text("question_id"), // For question-specific analysis
		type: text("type").$type<AnalysisType>().notNull(), // text_summary, sentiment, keywords
		data: json("data").$type<unknown>().notNull(),
		modelUsed: text("model_used"), // e.g., "llama-3.3-70b-versatile"
		tokensUsed: integer("tokens_used"),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("aiAnalysis_surveyId_idx").on(table.surveyId),
		index("aiAnalysis_type_idx").on(table.type),
		index("aiAnalysis_expiresAt_idx").on(table.expiresAt),
		index("aiAnalysis_surveyId_questionId_type_idx").on(
			table.surveyId,
			table.questionId,
			table.type,
		),
	],
);

// Relations
export const analyticsSnapshotRelations = relations(
	analyticsSnapshot,
	({ one }) => ({
		survey: one(survey, {
			fields: [analyticsSnapshot.surveyId],
			references: [survey.id],
		}),
	}),
);

export const aiAnalysisRelations = relations(aiAnalysis, ({ one }) => ({
	survey: one(survey, {
		fields: [aiAnalysis.surveyId],
		references: [survey.id],
	}),
}));

// Type definitions for analytics data
export interface SummaryAnalytics {
	totalResponses: number;
	completeResponses: number;
	partialResponses: number;
	completionRate: number;
	averageTimeSeconds: number | null;
}

export interface QuestionAnalytics {
	questionId: string;
	questionType: string;
	questionTitle: string;
	totalAnswers: number;
	distribution: Array<{
		value: string;
		count: number;
		percentage: number;
	}>;
	// For numeric questions
	average?: number;
	min?: number;
	max?: number;
	// For text questions
	sampleResponses?: string[];
}

export interface TrendDataPoint {
	date: string;
	responses: number;
	completions: number;
}

export interface DemographicsData {
	browsers: Array<{ name: string; count: number; percentage: number }>;
	devices: Array<{ name: string; count: number; percentage: number }>;
	os: Array<{ name: string; count: number; percentage: number }>;
	countries: Array<{ name: string; count: number; percentage: number }>;
}

// AI Analysis data types
export interface TextSummaryAnalysis {
	bullets: string[];
	totalResponses: number;
}

export interface SentimentAnalysis {
	positive: number;
	neutral: number;
	negative: number;
	totalResponses: number;
}

export interface KeywordsAnalysis {
	keywords: Array<{
		word: string;
		count: number;
		weight: number;
	}>;
	totalResponses: number;
}
