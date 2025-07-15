import { model } from "database/model";
import * as schema from "database/schema";
import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { setup } from "./setup";

export const userPlugin = new Elysia({
	name: "userPlugin",
	prefix: "/user",
})
	.use(setup)
	.guard({
		mustAuth: true,
	})
	.group("/me", (app) =>
		app.patch(
			"/",
			async ({ db, user, body }) => {
				await db
					.update(schema.user)
					.set(body)
					.where(eq(schema.user.id, user.id));
				return;
			},
			{
				body: t.Object({
					...model.update.user,
				}),
			},
		),
	);
