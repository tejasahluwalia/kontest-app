import { relations } from "drizzle-orm";
import {
	pgTable,
	text,
	boolean,
	timestamp,
	jsonb,
	primaryKey,
	pgEnum,
} from "drizzle-orm/pg-core";

import { createId } from "@paralleldrive/cuid2";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
	orgToHosts: many(orgToHost),
	callToHosts: many(callToHost),
	callToParticipants: many(callToParticipant),
	jurorToCalls: many(jurorToCall),
}));

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const org = pgTable("org", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orgRelations = relations(org, ({ many }) => ({
	orgToHost: many(orgToHost),
	calls: many(call),
}));

export const orgToHost = pgTable(
	"org_to_host",
	{
		orgId: text("org_id")
			.notNull()
			.references(() => org.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		role: text("role").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(t) => [primaryKey({ columns: [t.orgId, t.userId] })],
);

export const orgToHostRelations = relations(orgToHost, ({ one }) => ({
	org: one(org, {
		fields: [orgToHost.orgId],
		references: [org.id],
	}),
	user: one(user, {
		fields: [orgToHost.userId],
		references: [user.id],
	}),
}));

const callVisibilityEnum = pgEnum("visibility", [
	"public",
	"private",
	"restricted",
]);
const callStatusEnum = pgEnum("status", ["open", "closed"]);

export const call = pgTable("call", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	orgId: text("org_id")
		.notNull()
		.references(() => org.id, { onDelete: "cascade" }),
	schema: jsonb("schema"),
	visibility: callVisibilityEnum().notNull().default("private"),
	status: callStatusEnum().notNull().default("closed"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const callRelations = relations(call, ({ many, one }) => ({
	org: one(org, {
		fields: [call.orgId],
		references: [org.id],
	}),
	callToHost: many(callToHost),
	callToParticipant: many(callToParticipant),
	jurorToCall: many(jurorToCall),
	submissions: many(submission),
}));

export const callToHost = pgTable(
	"call_to_host",
	{
		callId: text("call_id")
			.notNull()
			.references(() => call.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		visibility: text("visibility").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(t) => [primaryKey({ columns: [t.callId, t.userId] })],
);

export const callToHostRelations = relations(callToHost, ({ one }) => ({
	call: one(call, {
		fields: [callToHost.callId],
		references: [call.id],
	}),
	user: one(user, {
		fields: [callToHost.userId],
		references: [user.id],
	}),
}));

export const callToParticipant = pgTable(
	"call_to_participant",
	{
		callId: text("call_id")
			.notNull()
			.references(() => call.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(t) => [primaryKey({ columns: [t.callId, t.userId] })],
);

export const callToParticipantRelations = relations(
	callToParticipant,
	({ one }) => ({
		call: one(call, {
			fields: [callToParticipant.callId],
			references: [call.id],
		}),
		user: one(user, {
			fields: [callToParticipant.userId],
			references: [user.id],
		}),
	}),
);

const jurorToCallStatusEnum = pgEnum("juror_status", ["pending", "completed"]);

export const jurorToCall = pgTable(
	"juror_to_call",
	{
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		callId: text("call_id")
			.notNull()
			.references(() => call.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
		data: jsonb("data"),
		status: jurorToCallStatusEnum().notNull().default("pending"),
	},
	(t) => [primaryKey({ columns: [t.callId, t.userId] })],
);

export const jurorToCallRelations = relations(jurorToCall, ({ one }) => ({
	user: one(user, {
		fields: [jurorToCall.userId],
		references: [user.id],
	}),
	call: one(call, {
		fields: [jurorToCall.callId],
		references: [call.id],
	}),
}));

export const submission = pgTable("submission", {
	id: text("id").notNull().primaryKey(),
	callId: text("call_id")
		.notNull()
		.references(() => call.id, { onDelete: "cascade" }),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	data: jsonb("data"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const submissionRelations = relations(submission, ({ one }) => ({
	call: one(call, {
		fields: [submission.callId],
		references: [call.id],
	}),
	user: one(user, {
		fields: [submission.userId],
		references: [user.id],
	}),
}));
