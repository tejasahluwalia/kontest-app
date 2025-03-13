import { t } from "elysia";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";

import * as table from "./schema";
import { spreads } from "./utils";

export const model = {
  insert: spreads(
    {
      user: createInsertSchema(table.user, {
        email: t.String({ format: "email" }),
      }),
      organization: createInsertSchema(table.organization, {
        name: t.String({ minLength: 2, maxLength: 100 }),
        slug: t.String({ minLength: 2, maxLength: 100 }),
      }),
      organizationToHost: createInsertSchema(table.organizationToHost, {
        userId: t.String({ format: "uuid" }),
        organizationId: t.String({ format: "uuid" }),
      }),
    },
    "insert",
  ),
  select: spreads(
    {
      organizationToHosts: createSelectSchema(table.organizationToHost, {
        userId: t.String({ format: "uuid" }),
      }),
      user: createSelectSchema(table.user, {
        email: t.String({ format: "email" }),
      }),
    },
    "select",
  ),
} as const;
