import { model } from "database/model";
import * as schema from "database/schema";
import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { setup } from "./setup";

export const hostPlugin = new Elysia({
	name: "hostPlugin",
	prefix: "/host",
})
	.use(setup)
	.guard({
		mustAuth: true,
	})
	.get("/", async ({ db, user }) => {
		const memberProfiles = await db.query.member.findMany({
			where: (m, { eq }) => eq(m.userId, user.id),
			with: {
				org: {
					with: {
						calls: {
							with: {
								rounds: true,
							},
						},
					},
				},
			},
		});
		return memberProfiles;
	})
	.group("/orgs", (app) =>
		app
			.post(
				"/",
				async ({ body, user, db }) => {
					const newOrg = await db.insert(schema.org).values(body).returning();
					await db
						.insert(schema.member)
						.values({ orgId: newOrg[0].id, userId: user.id, role: "admin" });
					return newOrg;
				},
				{
					body: t.Object({
						name: model.insert.org.name,
						slug: model.insert.org.slug,
					}),
				},
			)
			.get("/checkAvailability/:slug", async ({ params, db }) => {
				const existingOrg = await db.query.org.findFirst({
					where: (org, { eq }) => eq(org.slug, params.slug),
				});
				const isAvailable = !existingOrg;
				return {
					isAvailable,
				};
			})
			.group("/:orgSlug", (app) =>
				app
					.resolve(async ({ params, user, db, status }) => {
						const org = await db.query.org.findFirst({
							where: (o, { eq }) => eq(o.slug, params.orgSlug),
						});
						if (!org) {
							return status(404);
						}
						const member = await db.query.member.findFirst({
							where: (m, { eq }) =>
								eq(m.orgId, org.id) && eq(m.userId, user.id),
						});
						if (!member) {
							return status(401);
						}
						return { org, member };
					})
					.get("/", async ({ params, db, member }) => {
						const org = await db.query.org.findMany({
							where: (o, { eq }) => eq(o.id, member.orgId),
							with: {
								calls: true,
							},
						});
						return org;
					})
					.group("/members", (app) =>
						app
							.get("/", async ({ db, params }) => {
								const members = await db.query.member.findMany({
									where: eq(schema.member.orgId, params.orgId),
									with: {
										user: true,
									},
								});
								return members;
							})
							.group(
								"/:memberId",
								{
									beforeHandle: ({ status, member }) => {
										if (member.role !== "admin") {
											return status(401);
										}
									},
								},
								(app) =>
									app
										.patch(
											"/",
											async ({ db, body, params }) => {
												await db
													.update(schema.member)
													.set(body)
													.where(eq(schema.member.id, params.memberId));
												return;
											},
											{
												body: t.Object({
													role: model.update.member.role,
												}),
											},
										)
										.delete("/", async ({ db, params }) => {
											await db
												.delete(schema.member)
												.where(eq(schema.member.id, params.memberId));
											return;
										}),
							)

							.group(
								"/invites",
								{
									beforeHandle: ({ status, member }) => {
										if (member.role !== "admin") {
											return status(401);
										}
									},
								},
								(app) =>
									app
										.get("/", async ({ db, params }) => {
											const invites = db.query.memberInvite.findMany({
												where: eq(schema.memberInvite.orgId, params.orgId),
											});
											return invites;
										})
										.post(
											"/",
											async ({ db, body, params, status, member }) => {
												const userToBeAdded = await db.query.user.findFirst({
													where: (user, { eq }) => eq(user.email, body.email),
												});
												if (!userToBeAdded) {
													await db.insert(schema.memberInvite).values({
														orgId: params.orgId,
														email: body.email,
														invitedBy: member.id,
														role: body.role,
													});
													return status(201);
												}
												await db.insert(schema.member).values({
													orgId: params.orgId,
													userId: userToBeAdded.id,
													role: body.role,
												});
												return status(204);
											},
											{
												body: t.Object({
													email: model.select.user.email,
													role: model.insert.member.role,
												}),
											},
										)
										.delete("/:inviteId", async ({ db, params, status }) => {
											await db
												.delete(schema.memberInvite)
												.where(eq(schema.memberInvite.id, params.inviteId));
											return status(204);
										}),
							),
					)
					.group("/calls", (app) =>
						app
							.get("/checkAvailability/:slug", async ({ db, params }) => {
								const existingCall = await db.query.call.findFirst({
									where: (call, { eq, and }) =>
										and(
											eq(call.orgId, params.orgId),
											eq(call.slug, params.slug),
										),
								});
								const isAvailable = !existingCall;
								return {
									isAvailable,
								};
							})
							.post(
								"/",
								async ({ body, db, member, params }) => {
									const newCall = await db
										.insert(schema.call)
										.values({ ...body, orgId: params.orgId })
										.returning();
									await db.insert(schema.callToMember).values({
										callId: newCall[0].id,
										memberId: member.id,
										role: "admin",
									});
									return newCall;
								},
								{
									body: t.Object({
										name: model.insert.call.name,
										slug: model.insert.call.slug,
									}),
								},
							)
							.group("/:callId", (app) =>
								app
									.resolve(async ({ params, status, db, member }) => {
										const callToMember = await db.query.callToMember.findFirst({
											where: (cm, { eq, and }) =>
												and(
													eq(cm.callId, params.callId),
													eq(cm.memberId, member.id),
												),
											with: {
												call: {
													with: {
														rounds: true,
													},
												},
											},
										});
										if (!callToMember) {
											return status(401);
										}
										return {
											callToMember,
										};
									})
									.put(
										"/",
										async ({ body, params, status, db }) => {
											await db
												.update(schema.call)
												.set({
													...body,
													updatedAt: new Date(),
												})
												.where(eq(schema.call.id, params.callId));

											return status(202);
										},
										{
											body: t.Object(model.insert.call),
										},
									)
									.get("/", async ({ callToMember }) => {
										return { ...callToMember.call };
									})
									.delete("/", async ({ db, params, status }) => {
										await db
											.delete(schema.call)
											.where(eq(schema.call.id, params.callId));
										return status(202);
									})
									.group("/team", (app) =>
										app
											.get("/", async ({ db, params }) => {
												const { callId } = params;
												const team = await db.query.callToMember.findMany({
													where: eq(schema.callToMember.callId, callId),
													with: {
														member: {
															with: {
																user: true,
															},
														},
													},
												});
												return team;
											})
											.post(
												"/",
												async ({ db, body }) => {
													await db.insert(schema.callToMember).values(body);
													return;
												},
												{
													body: t.Object(model.insert.callToMember),
												},
											),
									)
									.group(
										"/rounds",
										(
											app, // New rounds group
										) =>
											app
												.post(
													"/",
													async ({
														body,
														status,
														db,
														params,
														callToMember,
													}) => {
														if (callToMember.role !== "admin") {
															return status(401);
														}
														const newRound = await db
															.insert(schema.round)
															.values({ ...body, callId: params.callId })
															.returning();
														return newRound;
													},
													{
														body: t.Object({
															name: model.insert.round.name,
															slug: model.insert.round.slug,
															formSchema: model.insert.round.formSchema,
															judgingSchema: model.insert.round.judgingSchema,
														}),
													},
												)
												.get("/", async ({ db, params }) => {
													const rounds = await db.query.round.findMany({
														where: (round, { eq }) =>
															eq(round.callId, params.callId),
													});
													return rounds;
												})
												.get(
													"/checkAvailability/:slug",
													async ({ db, params }) => {
														const existingRound =
															await db.query.round.findFirst({
																where: (round, { eq, and }) =>
																	and(
																		eq(round.callId, params.callId),
																		eq(round.slug, params.slug),
																	),
															});
														const isAvailable = !existingRound;
														return {
															isAvailable,
														};
													},
												)
												.group("/:roundId", (app) =>
													app
														.resolve(async ({ params, db, status }) => {
															const round = await db.query.round.findFirst({
																where: (round, { and, eq }) =>
																	and(
																		eq(round.id, params.roundId),
																		eq(round.callId, params.callId),
																	),
															});
															if (!round) {
																return status(404);
															}
															return { round };
														})
														.get("/", async ({ round }) => round)
														.put(
															"/",
															async ({ body, params, status, db }) => {
																await db
																	.update(schema.round)
																	.set({
																		...body,
																		updatedAt: new Date(),
																	})
																	.where(eq(schema.round.id, params.roundId));
																return status(202);
															},
															{
																body: t.Object({
																	name: t.Optional(model.insert.round.name),
																	slug: t.Optional(model.insert.round.slug),
																	formSchema: t.Optional(t.Any()),
																	judgingSchema: t.Optional(t.Any()),
																	metadata: t.Optional(t.Any()),
																	startDate: t.Optional(t.Date()),
																	endDate: t.Optional(t.Date()),
																}),
															},
														)
														.delete("/", async ({ db, params, status }) => {
															await db
																.delete(schema.round)
																.where(eq(schema.round.id, params.roundId));
															return status(202);
														}),
												),
									),
							),
					),
			),
	);
