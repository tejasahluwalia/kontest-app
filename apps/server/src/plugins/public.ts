import * as schema from "@db/schema";
import { and, eq, inArray } from "drizzle-orm";
import Elysia, { status, t } from "elysia";
import { setup } from "./setup";

export const publicPlugin = new Elysia({
	name: "public-plugin",
})
	.use(setup)
	.group("/calls", (app) =>
		app
			.get("/", async ({ db }) => {
				const calls = await db.query.call.findMany({
					where: { visibility: "public" },
					columns: {
						id: true,
						name: true,
						slug: true,
						createdAt: true,
						updatedAt: true,
					},
				});
				return calls;
			})
			.get(
				"/:id",
				{
					params: t.Object({
						id: t.String(),
					}),
					maybeAuth: true,
				},
				async ({ db, params, user }) => {
					const call = await db.query.call.findFirst({
						where: { id: params.id },
						columns: {
							id: true,
							name: true,
							slug: true,
							createdAt: true,
							updatedAt: true,
							visibility: true,
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

					const userMemberships = await db.query.member.findMany({
						where: { userId: user.id },
						columns: { id: true },
					});
					const memberIds = userMemberships.map((membership) => membership.id);
					const [isUserHost] = memberIds.length
						? await db
								.select()
								.from(schema.callToMember)
								.where(
									and(
										eq(schema.callToMember.callId, call.id),
										inArray(schema.callToMember.memberId, memberIds),
									),
								)
								.limit(1)
						: [];

					if (call.visibility === "private" && !isUserHost) {
						return status(
							403,
							"This call is private. Only hosts can access it right now.",
						);
					}

					const isUserParticipant = await db.query.participant.findFirst({
						where: {
							callId: call.id,
							userId: user.id,
						},
					});

					if (
						call.visibility === "restricted" &&
						!isUserParticipant &&
						!isUserHost
					) {
						return status(
							403,
							"This call is restricted. Only participants and hosts can access it right now.",
						);
					}

					return call;
				},
			),
	);
