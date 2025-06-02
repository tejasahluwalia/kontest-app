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
      org: createInsertSchema(table.org, {
        name: t.String({ minLength: 2, maxLength: 100 }),
        slug: t.String({ minLength: 2, maxLength: 100 }),
      }),
      orgToHost: createInsertSchema(table.orgToHost),
      call: createInsertSchema(table.call),
    },
    "insert",
  ),
  select: spreads(
    {
      orgToHosts: createSelectSchema(table.orgToHost),
      user: createSelectSchema(table.user, {
        email: t.String({ format: "email" }),
      }),
      org: createSelectSchema(table.org),
      call: createSelectSchema(table.call),
    },
    "select",
  ),
} as const;
