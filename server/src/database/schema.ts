import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  boolean,
  timestamp,
  jsonb,
  primaryKey,
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
  organizationToHosts: many(organizationToHost),
  contestToHosts: many(contestToHost),
  contestToParticipants: many(contestToParticipant),
  jurorToContests: many(jurorToContest),
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

export const organization = pgTable("organization", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const organizationRelations = relations(organization, ({ many }) => ({
  organizationToHost: many(organizationToHost),
  contests: many(contest),
}));

export const organizationToHost = pgTable(
  "organization_to_host",
  {
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.organizationId, t.userId] })],
);

export const organizationToHostRelations = relations(
  organizationToHost,
  ({ one }) => ({
    organization: one(organization, {
      fields: [organizationToHost.organizationId],
      references: [organization.id],
    }),
    user: one(user, {
      fields: [organizationToHost.userId],
      references: [user.id],
    }),
  }),
);

export const contest = pgTable("contest", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  schema: jsonb("schema"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contestRelations = relations(contest, ({ many, one }) => ({
  organization: one(organization, {
    fields: [contest.organizationId],
    references: [organization.id],
  }),
  contestToHost: many(contestToHost),
  contestToParticipant: many(contestToParticipant),
  jurorToContest: many(jurorToContest),
  submissions: many(submission),
}));

export const contestToHost = pgTable(
  "contest_to_host",
  {
    contestId: text("contest_id")
      .notNull()
      .references(() => contest.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    visibility: text("visibility").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.contestId, t.userId] })],
);

export const contestToHostRelations = relations(contestToHost, ({ one }) => ({
  contest: one(contest, {
    fields: [contestToHost.contestId],
    references: [contest.id],
  }),
  user: one(user, {
    fields: [contestToHost.userId],
    references: [user.id],
  }),
}));

export const contestToParticipant = pgTable(
  "contest_to_participant",
  {
    contestId: text("contest_id")
      .notNull()
      .references(() => contest.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.contestId, t.userId] })],
);

export const contestToParticipantRelations = relations(
  contestToParticipant,
  ({ one }) => ({
    contest: one(contest, {
      fields: [contestToParticipant.contestId],
      references: [contest.id],
    }),
    user: one(user, {
      fields: [contestToParticipant.userId],
      references: [user.id],
    }),
  }),
);

export const jurorToContest = pgTable(
  "juror_to_contest",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    contestId: text("contest_id")
      .notNull()
      .references(() => contest.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.contestId, t.userId] })],
);

export const jurorToContestRelations = relations(jurorToContest, ({ one }) => ({
  user: one(user, {
    fields: [jurorToContest.userId],
    references: [user.id],
  }),
  contest: one(contest, {
    fields: [jurorToContest.contestId],
    references: [contest.id],
  }),
}));

export const submission = pgTable("submission", {
  id: text("id").notNull().primaryKey(),
  contestId: text("contest_id")
    .notNull()
    .references(() => contest.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  data: jsonb("data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const submissionRelations = relations(submission, ({ one }) => ({
  contest: one(contest, {
    fields: [submission.contestId],
    references: [contest.id],
  }),
  user: one(user, {
    fields: [submission.userId],
    references: [user.id],
  }),
}));
