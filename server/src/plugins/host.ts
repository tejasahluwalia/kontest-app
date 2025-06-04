import { model } from "@server/database/model";
import { betterAuth } from "@server/plugins/auth";
import { createCall } from "@server/services/call";
import { checkOrgMembership, getOrgById } from "@server/services/org";
import Elysia, { status, t } from "elysia";

export const hostController = new Elysia({
	name: "hostController",
	prefix: "/api/orgs/:orgSlug",
})
	.use(betterAuth)
	.guard({
		mustAuth: true,
		query: t.Object({
			orgId: model.select.org.id,
		}),
	})
	.resolve(async ({ status, user, query: { orgId } }) => {
		const result = await checkOrgMembership({
			userId: user.id,
			orgId,
		});
		if (!result) {
			return status(403, "Forbidden: You are not a member of this org");
		}
		return {
			isOrgMember: true,
		};
	})
	.get("/", async ({ params, set, query: { orgId } }) => {
		const org = await getOrgById(orgId);
		if (!org) {
			set.status = 404;
			return status(404, "Org not found");
		}
		return org;
	})
	.post(
		"/calls/create",
		async ({ body, params, user, set }) => {
			const newCall = await createCall(body);
			set.status = 201;
			return newCall.id;
		},
		{
			body: t.Object({
				name: model.insert.call.name,
				slug: model.insert.call.slug,
				schema: model.insert.call.schema,
				orgId: model.insert.call.orgId,
			}),
		},
	);
