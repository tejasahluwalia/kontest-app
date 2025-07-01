import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
	boolean,
	jsonb,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	unique,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

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
	metadata: jsonb("metadata"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orgRelations = relations(org, ({ many }) => ({
	members: many(member),
	calls: many(call),
	invites: many(memberInvite),
}));

export const memberRoleEnum = pgEnum("org_member_role", ["admin", "member"]);

export const member = pgTable(
	"member",
	{
		id: text("id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" })
			.primaryKey(),
		orgId: text("org_id")
			.notNull()
			.references(() => org.id, { onDelete: "cascade" }),
		role: memberRoleEnum("org_member_role").notNull().default("member"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(t) => [unique().on(t.orgId, t.id)],
);

export const memberRelations = relations(member, ({ one }) => ({
	org: one(org, {
		fields: [member.orgId],
		references: [org.id],
	}),
	user: one(user, {
		fields: [member.id],
		references: [user.id],
	}),
}));

export const round = pgTable("round", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	callId: text("call_id")
		.notNull()
		.references(() => call.id, { onDelete: "cascade" }),
	formSchema: jsonb("form_schema"),
	judgingSchema: jsonb("judging_schema"),
	metadata: jsonb("metadata"),
	startDate: timestamp("start_date"),
	endDate: timestamp("end_date"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const roundRelations = relations(round, ({ one, many }) => ({
	call: one(call, {
		fields: [round.callId],
		references: [call.id],
	}),
	jurors: many(juror),
	submissions: many(submission),
	judgements: many(judgement),
}));

export const callVisibilityEnum = pgEnum("call_visibility", [
	"public",
	"private",
	"restricted",
]);

export const call = pgTable("call", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	orgId: text("org_id")
		.notNull()
		.references(() => org.id, { onDelete: "cascade" }),
	metadata: jsonb("metadata"),
	visibility: callVisibilityEnum("call_visibility")
		.notNull()
		.default("private"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const callRelations = relations(call, ({ many, one }) => ({
	org: one(org, {
		fields: [call.orgId],
		references: [org.id],
	}),
	callToMembers: many(callToMember),
	rounds: many(round),
	participants: many(participant),
}));

export const callToMemberRoleEnum = pgEnum("call_to_member_role", ["admin"]);

export const callToMember = pgTable(
	"call_to_member",
	{
		callId: text("call_id")
			.notNull()
			.references(() => call.id, { onDelete: "cascade" }),
		memberId: text("member_id")
			.notNull()
			.references(() => member.id, { onDelete: "cascade" }),
		role: callToMemberRoleEnum("call_to_member_role")
			.notNull()
			.default("admin"),
	},
	(t) => [primaryKey({ columns: [t.callId, t.memberId] })],
);

export const callToMemberRelations = relations(callToMember, ({ one }) => ({
	call: one(call, {
		fields: [callToMember.callId],
		references: [call.id],
	}),
	member: one(member, {
		fields: [callToMember.memberId],
		references: [member.id],
	}),
}));

export const participant = pgTable(
	"participant",
	{
		id: text("id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" })
			.primaryKey(),
		callId: text("call_id")
			.notNull()
			.references(() => call.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(t) => [unique().on(t.callId, t.id)],
);

export const participantRelations = relations(participant, ({ one, many }) => ({
	call: one(call, {
		fields: [participant.callId],
		references: [call.id],
	}),
	user: one(user, {
		fields: [participant.id],
		references: [user.id],
	}),
	submissions: many(submission),
}));

export const juror = pgTable(
	"juror",
	{
		id: text("id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" })
			.primaryKey(),
		roundId: text("round_id")
			.notNull()
			.references(() => round.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(t) => [unique().on(t.id, t.roundId)],
);

export const jurorRelations = relations(juror, ({ one, many }) => ({
	user: one(user, {
		fields: [juror.id],
		references: [user.id],
	}),
	round: one(round, {
		fields: [juror.roundId],
		references: [round.id],
	}),
	judgements: many(judgement),
}));

export const submission = pgTable("submission", {
	id: text("id").notNull().primaryKey(),
	roundId: text("round_id")
		.notNull()
		.references(() => round.id, { onDelete: "cascade" }),
	participantId: text("participant_id")
		.notNull()
		.references(() => participant.id, { onDelete: "cascade" }),
	data: jsonb("data"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const submissionRelations = relations(submission, ({ one, many }) => ({
	round: one(round, {
		fields: [submission.roundId],
		references: [round.id],
	}),
	participant: one(participant, {
		fields: [submission.participantId],
		references: [participant.id],
	}),
	judgement: many(judgement),
}));

export const judgement = pgTable(
	"judgement",
	{
		id: text("id").notNull().primaryKey(),
		submissionId: text("submission_id")
			.notNull()
			.references(() => submission.id, { onDelete: "cascade" }),
		jurorId: text("juror_id")
			.notNull()
			.references(() => juror.id, { onDelete: "cascade" }),
		data: jsonb("data"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(t) => [unique().on(t.jurorId, t.submissionId)],
);

export const judgementRelations = relations(judgement, ({ one }) => ({
	submission: one(submission, {
		fields: [judgement.submissionId],
		references: [submission.id],
	}),
	juror: one(juror, {
		fields: [judgement.jurorId],
		references: [juror.id],
	}),
}));

export const inviteStatusEnum = pgEnum("invite_status", [
	"pending",
	"accepted",
]);

export const memberInvite = pgTable("member_invite", {
	id: text("id").notNull().primaryKey(),
	email: text("email").notNull(),
	orgId: text("org_id")
		.notNull()
		.references(() => org.id, { onDelete: "cascade" }),
	role: memberRoleEnum("org_member_role").notNull().default("member"),
	status: inviteStatusEnum("invite_status").notNull().default("pending"),
	invitedBy: text("invited_by")
		.notNull()
		.references(() => member.id),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const memberInviteRelations = relations(memberInvite, ({ one }) => ({
	org: one(org, {
		fields: [memberInvite.orgId],
		references: [org.id],
	}),
	invitee: one(member, {
		fields: [memberInvite.invitedBy],
		references: [member.id],
	}),
}));

export const jurorInvite = pgTable("juror_invite", {
	id: text("id").notNull().primaryKey(),
	email: text("email").notNull(),
	roundId: text("round_id")
		.notNull()
		.references(() => round.id, { onDelete: "cascade" }),
	status: inviteStatusEnum("invite_status").notNull().default("pending"),
	invitedBy: text("invited_by")
		.notNull()
		.references(() => member.id),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const jurorInviteRelations = relations(jurorInvite, ({ one }) => ({
	round: one(round, {
		fields: [jurorInvite.roundId],
		references: [round.id],
	}),
}));
