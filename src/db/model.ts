import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-typebox";
import { t } from "elysia";

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
			member: table.member,
			call: table.call,
			round: table.round,
			callToMember: table.callToMember,
		},
		"insert",
	),
	select: spreads(
		{
			member: table.member,
			user: createSelectSchema(table.user, {
				email: t.String({ format: "email" }),
			}),
			org: table.org,
			call: table.call,
			round: table.round,
		},
		"select",
	),
	update: spreads(
		{
			user: createUpdateSchema(table.user, {
				email: t.String({ format: "email" }),
			}),
			member: table.member,
			call: table.call,
			round: table.round,
			callToMember: table.callToMember,
		},
		"update",
	),
} as const;
