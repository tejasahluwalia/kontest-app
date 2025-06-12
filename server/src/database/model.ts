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
			orgToHost: table.orgToHost,
			call: table.call,
		},
		"insert",
	),
	select: spreads(
		{
			orgToHosts: table.orgToHost,
			user: createSelectSchema(table.user, {
				email: t.String({ format: "email" }),
			}),
			org: table.org,
			call: table.call,
		},
		"select",
	),
} as const;
