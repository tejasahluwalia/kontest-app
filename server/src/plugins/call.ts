import { model } from "@server/database/model";
import { betterAuth } from "@server/plugins/auth";
import {
	checkCallAvailability,
	checkCallBelongsToOrg,
	deleteCall,
	getCallBySlug,
	updateCall,
} from "@server/services/call";
import { checkOrgMembership } from "@server/services/org";
import Elysia, { status, t } from "elysia";
import { setup } from "./setup";

export const publicCallPlugin = new Elysia({
	name: "public-call-plugin",
	prefix: "/calls",
})
	.use(setup)
	.get(
		"/",
		async ({ db, query }) => {
			const calls = await db.query.call.findMany({
				where: (call, { eq, and }) =>
					and(
						eq(call.visibility, "public"),
						eq(call.status, query.status || "open"),
					),
				columns: {
					id: true,
					name: true,
					slug: true,
					createdAt: true,
					updatedAt: true,
				},
			});
			return calls;
		},
		{
			query: t.Object({
				status: t.Optional(model.select.call.status),
			}),
		},
	)
	.get(
		"/:id",
		async ({ db, params, user }) => {
			const call = await db.query.call.findFirst({
				where: (call, { eq, and }) => and(eq(call.id, params.id)),
				columns: {
					id: true,
					name: true,
					slug: true,
					createdAt: true,
					updatedAt: true,
					visibility: true,
					status: true,
				},
				with: {
					callToParticipant: true,
				},
			});
			if (!call) {
				return status(404, "Call not found");
			}

			if (call.visibility === "public") {
				return call;
			}

			if (!user) {
				return status(
					401,
					"This call is private or restricted. Please log in to access it.",
				);
			}

			const isUserHost = await db.query.callToHost.findFirst({
				where: (table, { eq }) => eq(table.callId, call.id),
				columns: {
					userId: true,
				},
			});

			if (call.visibility === "private" && !isUserHost) {
				return status(
					403,
					"This call is private. Only hosts can access it right now.",
				);
			}

			const isUserParticipant = await db.query.callToParticipant.findFirst({
				where: (table, { eq }) => eq(table.callId, call.id),
				columns: {
					userId: true,
				},
			});

			if (
				call.visibility === "restricted" &&
				(!isUserParticipant || !isUserHost)
			) {
				return status(
					403,
					"This call is restricted. Only participants and hosts can access it right now.",
				);
			}

			return call;
		},
		{
			maybeAuth: true,
		},
	);

export const callPlugin = new Elysia({
	name: "callPlugin",
	prefix: "/calls",
})
	.use(setup)
	.guard({
		mustAuth: true,
	})
	.get("/checkAvailability/:slug", async ({ params }) => {
		const isAvailable = await checkCallAvailability(params.slug);
		return {
			isAvailable,
		};
	})
	.guard({
		query: t.Object({
			orgId: model.select.org.id,
			callId: model.select.call.id,
		}),
	})
	.derive(async ({ status, params, user, query: { orgId, callId } }) => {
		const isUserBelongsToOrg = await checkOrgMembership({
			userId: user.id,
			orgId,
		});
		const isCallBelongsToOrg = await checkCallBelongsToOrg({
			callId,
			orgId,
		});

		return {
			isCallBelongsToOrg,
			isUserBelongsToOrg,
		};
	})
	.get("/", async ({ params, set, query: { orgId, callId } }) => {
		const call = await getCallBySlug({
			orgId,
			callId,
		});
		if (!call) {
			set.status = 404;
			return status(404, "Call not found");
		}
		return call;
	})
	.delete("/", async ({ params, set, query: { orgId, callId } }) => {
		await deleteCall(callId);
		return;
	})
	.post(
		"/update",
		async ({ body, params, set }) => {
			if (!body.id) {
				set.status = 400;
				return status(400, "Missing call ID");
			}
			const updatedCall = await updateCall(body.id, body);
			set.status = 200;
			return updatedCall;
		},
		{
			body: t.Object({
				id: model.insert.call.id,
				name: model.insert.call.name,
				slug: model.insert.call.slug,
				schema: model.insert.call.schema,
				orgId: model.insert.call.orgId,
			}),
		},
	);
