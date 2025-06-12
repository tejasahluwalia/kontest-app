import { model } from "@server/database/model";
import Elysia, { status, t } from "elysia";
import { setup } from "./setup";

export const publicPlugin = new Elysia({
	name: "public-plugin",
})
	.use(setup)
	.group("/calls", (app) =>
		app
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
			),
	);
