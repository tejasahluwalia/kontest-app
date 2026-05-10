import Elysia, { status } from "elysia";
import { setup } from "./setup";

export const publicPlugin = new Elysia({
	name: "public-plugin",
})
	.use(setup)
	.group("/calls", (app) =>
		app
			.get("/", async ({ db }) => {
				const calls = await db.query.call.findMany({
					where: (call, { eq, and }) => and(eq(call.visibility, "public")),
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

					const isUserHost = await db.query.callToMember.findFirst({
						where: (callToMember, { eq, and }) =>
							and(
								eq(callToMember.callId, call.id),
								eq(callToMember.memberId, user.id),
							),
					});

					if (call.visibility === "private" && !isUserHost) {
						return status(
							403,
							"This call is private. Only hosts can access it right now.",
						);
					}

					const isUserParticipant = await db.query.participant.findFirst({
						where: (participant, { eq, and }) =>
							and(eq(participant.callId, call.id), eq(participant.id, user.id)),
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
