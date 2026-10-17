import { model } from "@db/model";
import * as schema from "@db/schema";
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
			{
				body: t.Object({
					...model.update.user,
				}),
			},
			async ({ db, user, body }) => {
				await db
					.update(schema.user)
					.set(body)
					.where(eq(schema.user.id, user.id));
				return;
			},
		),
	);
