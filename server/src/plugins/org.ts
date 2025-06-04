import { model } from "@server/database/model";
import { betterAuth } from "@server/plugins/auth";
import {
	checkOrgAvailability,
	createOrg,
	getOrgsByUserId,
} from "@server/services/org";
import Elysia, { t } from "elysia";

export const orgPlugin = new Elysia({
	name: "orgPlugin",
	prefix: "/orgs",
})
	.use(betterAuth)
	.guard({
		mustAuth: true,
	})
	.get("/", async ({ set, user, session, status, ...ctx }) => {
		return await getOrgsByUserId(user.id);
	})
	.get(
		"/checkAvailability/:slug",
		async ({ set, user, session, status, ...ctx }) => {
			const isAvailable = await checkOrgAvailability(ctx.params.slug);
			return {
				isAvailable,
			};
		},
	)
	.post(
		"/create",
		async ({ body, user, set }) => {
			const newOrg = await createOrg(body.name, body.slug, user.id);
			set.status = 201;
			return newOrg;
		},
		{
			body: t.Object({
				name: model.insert.org.name,
				slug: model.insert.org.slug,
			}),
		},
	);
