import { relations } from "drizzle-orm";
import {
	index,
	json,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

import { user } from "./auth";

// Member role enum
export const memberRoleEnum = pgEnum("member_role", [
	"owner",
	"admin",
	"member",
]);

// Invitation status enum
export const invitationStatusEnum = pgEnum("invitation_status", [
	"pending",
	"accepted",
	"rejected",
	"expired",
]);

// Organization table
export const organization = pgTable(
	"organization",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		slug: text("slug").notNull(),
		logo: text("logo"),
		metadata: json("metadata").$type<OrganizationMetadata>(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [uniqueIndex("organization_slug_idx").on(table.slug)],
);

// Member table
export const member = pgTable(
	"member",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		role: memberRoleEnum("role").default("member").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("member_userId_idx").on(table.userId),
		index("member_organizationId_idx").on(table.organizationId),
		uniqueIndex("member_user_organization_idx").on(
			table.userId,
			table.organizationId,
		),
	],
);

// Invitation table
export const invitation = pgTable(
	"invitation",
	{
		id: text("id").primaryKey(),
		email: text("email").notNull(),
		inviterId: text("inviter_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		role: memberRoleEnum("role").default("member").notNull(),
		status: invitationStatusEnum("status").default("pending").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("invitation_email_idx").on(table.email),
		index("invitation_organizationId_idx").on(table.organizationId),
		index("invitation_status_idx").on(table.status),
	],
);

// Relations
export const organizationRelations = relations(organization, ({ many }) => ({
	members: many(member),
	invitations: many(invitation),
}));

export const memberRelations = relations(member, ({ one }) => ({
	user: one(user, {
		fields: [member.userId],
		references: [user.id],
	}),
	organization: one(organization, {
		fields: [member.organizationId],
		references: [organization.id],
	}),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
	inviter: one(user, {
		fields: [invitation.inviterId],
		references: [user.id],
	}),
	organization: one(organization, {
		fields: [invitation.organizationId],
		references: [organization.id],
	}),
}));

// Type definitions for JSON fields
export interface OrganizationMetadata {
	website?: string;
	description?: string;
	industry?: string;
	size?: "1-10" | "11-50" | "51-200" | "201-500" | "500+";
}
