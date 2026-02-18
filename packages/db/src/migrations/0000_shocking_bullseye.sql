CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'accepted', 'rejected', 'expired');--> statement-breakpoint
CREATE TYPE "public"."member_role" AS ENUM('owner', 'admin', 'member');--> statement-breakpoint
CREATE TYPE "public"."logic_action" AS ENUM('jump_to', 'skip', 'show', 'hide', 'end_survey');--> statement-breakpoint
CREATE TYPE "public"."logic_operator" AS ENUM('equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'is_empty', 'is_not_empty');--> statement-breakpoint
CREATE TYPE "public"."question_type" AS ENUM('text', 'textarea', 'multiple_choice', 'checkbox', 'dropdown', 'rating', 'nps', 'linear_scale', 'date', 'email', 'phone', 'file_upload');--> statement-breakpoint
CREATE TYPE "public"."survey_status" AS ENUM('draft', 'published', 'closed', 'archived');--> statement-breakpoint
CREATE TABLE "ai_analysis" (
	"id" text PRIMARY KEY NOT NULL,
	"survey_id" text NOT NULL,
	"question_id" text,
	"type" text NOT NULL,
	"data" json NOT NULL,
	"model_used" text,
	"tokens_used" integer,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analytics_snapshot" (
	"id" text PRIMARY KEY NOT NULL,
	"survey_id" text NOT NULL,
	"type" text NOT NULL,
	"question_id" text,
	"data" json NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"active_organization_id" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"inviter_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"role" "member_role" DEFAULT 'member' NOT NULL,
	"status" "invitation_status" DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"role" "member_role" DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text,
	"metadata" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "answer" (
	"id" text PRIMARY KEY NOT NULL,
	"response_id" text NOT NULL,
	"question_id" text NOT NULL,
	"value" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "logic_rule" (
	"id" text PRIMARY KEY NOT NULL,
	"survey_id" text NOT NULL,
	"source_question_id" text NOT NULL,
	"operator" "logic_operator" NOT NULL,
	"condition_value" json,
	"action" "logic_action" NOT NULL,
	"target_question_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question" (
	"id" text PRIMARY KEY NOT NULL,
	"survey_id" text NOT NULL,
	"type" "question_type" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"config" json,
	"required" boolean DEFAULT false NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "response" (
	"id" text PRIMARY KEY NOT NULL,
	"survey_id" text NOT NULL,
	"respondent_id" text,
	"fingerprint" text,
	"metadata" json,
	"is_complete" boolean DEFAULT false NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "survey" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" "survey_status" DEFAULT 'draft' NOT NULL,
	"settings" json,
	"user_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "todo" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_analysis" ADD CONSTRAINT "ai_analysis_survey_id_survey_id_fk" FOREIGN KEY ("survey_id") REFERENCES "public"."survey"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_snapshot" ADD CONSTRAINT "analytics_snapshot_survey_id_survey_id_fk" FOREIGN KEY ("survey_id") REFERENCES "public"."survey"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answer" ADD CONSTRAINT "answer_response_id_response_id_fk" FOREIGN KEY ("response_id") REFERENCES "public"."response"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answer" ADD CONSTRAINT "answer_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logic_rule" ADD CONSTRAINT "logic_rule_survey_id_survey_id_fk" FOREIGN KEY ("survey_id") REFERENCES "public"."survey"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logic_rule" ADD CONSTRAINT "logic_rule_source_question_id_question_id_fk" FOREIGN KEY ("source_question_id") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logic_rule" ADD CONSTRAINT "logic_rule_target_question_id_question_id_fk" FOREIGN KEY ("target_question_id") REFERENCES "public"."question"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question" ADD CONSTRAINT "question_survey_id_survey_id_fk" FOREIGN KEY ("survey_id") REFERENCES "public"."survey"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "response" ADD CONSTRAINT "response_survey_id_survey_id_fk" FOREIGN KEY ("survey_id") REFERENCES "public"."survey"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "survey" ADD CONSTRAINT "survey_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "survey" ADD CONSTRAINT "survey_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "aiAnalysis_surveyId_idx" ON "ai_analysis" USING btree ("survey_id");--> statement-breakpoint
CREATE INDEX "aiAnalysis_type_idx" ON "ai_analysis" USING btree ("type");--> statement-breakpoint
CREATE INDEX "aiAnalysis_expiresAt_idx" ON "ai_analysis" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "aiAnalysis_surveyId_questionId_type_idx" ON "ai_analysis" USING btree ("survey_id","question_id","type");--> statement-breakpoint
CREATE INDEX "analyticsSnapshot_surveyId_idx" ON "analytics_snapshot" USING btree ("survey_id");--> statement-breakpoint
CREATE INDEX "analyticsSnapshot_type_idx" ON "analytics_snapshot" USING btree ("type");--> statement-breakpoint
CREATE INDEX "analyticsSnapshot_expiresAt_idx" ON "analytics_snapshot" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "analyticsSnapshot_surveyId_type_idx" ON "analytics_snapshot" USING btree ("survey_id","type");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_activeOrganizationId_idx" ON "session" USING btree ("active_organization_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "invitation_email_idx" ON "invitation" USING btree ("email");--> statement-breakpoint
CREATE INDEX "invitation_organizationId_idx" ON "invitation" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "invitation_status_idx" ON "invitation" USING btree ("status");--> statement-breakpoint
CREATE INDEX "member_userId_idx" ON "member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "member_organizationId_idx" ON "member" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "member_user_organization_idx" ON "member" USING btree ("user_id","organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_slug_idx" ON "organization" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "answer_responseId_idx" ON "answer" USING btree ("response_id");--> statement-breakpoint
CREATE INDEX "answer_questionId_idx" ON "answer" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "answer_questionId_responseId_idx" ON "answer" USING btree ("question_id","response_id");--> statement-breakpoint
CREATE INDEX "logicRule_surveyId_idx" ON "logic_rule" USING btree ("survey_id");--> statement-breakpoint
CREATE INDEX "logicRule_sourceQuestionId_idx" ON "logic_rule" USING btree ("source_question_id");--> statement-breakpoint
CREATE INDEX "question_surveyId_idx" ON "question" USING btree ("survey_id");--> statement-breakpoint
CREATE INDEX "question_order_idx" ON "question" USING btree ("order");--> statement-breakpoint
CREATE INDEX "response_surveyId_idx" ON "response" USING btree ("survey_id");--> statement-breakpoint
CREATE INDEX "response_fingerprint_idx" ON "response" USING btree ("fingerprint");--> statement-breakpoint
CREATE INDEX "response_isComplete_idx" ON "response" USING btree ("is_complete");--> statement-breakpoint
CREATE INDEX "response_surveyId_completedAt_idx" ON "response" USING btree ("survey_id","completed_at");--> statement-breakpoint
CREATE INDEX "response_surveyId_isComplete_idx" ON "response" USING btree ("survey_id","is_complete");--> statement-breakpoint
CREATE INDEX "response_surveyId_createdAt_idx" ON "response" USING btree ("survey_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "survey_org_slug_idx" ON "survey" USING btree ("organization_id","slug");--> statement-breakpoint
CREATE INDEX "survey_organizationId_idx" ON "survey" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "survey_userId_idx" ON "survey" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "survey_status_idx" ON "survey" USING btree ("status");