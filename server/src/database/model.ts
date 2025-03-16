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
      organizationToHost: createInsertSchema(table.organizationToHost),
      contest: createInsertSchema(table.contest),
    },
    "insert",
  ),
  select: spreads(
    {
      organizationToHosts: createSelectSchema(table.organizationToHost),
      user: createSelectSchema(table.user, {
        email: t.String({ format: "email" }),
      }),
      organization: createSelectSchema(table.organization),
      contest: createSelectSchema(table.contest),
    },
    "select",
  ),
} as const;
