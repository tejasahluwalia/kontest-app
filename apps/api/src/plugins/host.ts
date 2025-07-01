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
	.group("/orgs", (app) =>
		app
			.get("/", async ({ db, user }) => {
				const memberProfiles = await db.query.member.findMany({
					where: (member, { eq }) => eq(member.id, user.id),
					with: {
						org: {
							with: {
								calls: {
									columns: { id: true, slug: true, name: true },
									with: {
										rounds: {
											columns: { id: true, slug: true, name: true },
										},
									},
								},
							},
						},
					},
				});
				const orgs = memberProfiles.map((memberProfile) => {
					return {
						...memberProfile.org,
						role: memberProfile.role,
					};
				});
				return orgs;
			})
			.post(
				"/",
				async ({ body, user, db }) => {
					const newOrg = await db.insert(schema.org).values(body).returning();
					await db
						.insert(schema.member)
						.values({ orgId: newOrg[0].id, id: user.id, role: "admin" });
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
			.group("/:orgId", (app) =>
				app
					.resolve(async ({ params, user, db, status }) => {
						const member = await db.query.member.findFirst({
							where: (member, { and, eq }) =>
								and(eq(member.id, user.id), eq(member.orgId, params.orgId)),
							with: {
								org: true,
							},
						});
						if (!member) {
							return status(401);
						}
						return { member };
					})
					.get("/", async ({ params, db, member }) => {
						const calls = await db.query.call.findMany({
							where: (call, { eq }) => eq(call.orgId, params.orgId),
						});
						return {
							...member.org,
							calls,
						};
					})
					.group("/members", (app) =>
						app
							.get("/", async ({ db, params, status }) => {
								const members = await db.query.member.findMany({
									where: (member, { eq }) => eq(member.orgId, params.orgId),
									with: {
										user: true,
									},
								});
								return status(200, members);
							})
							.post(
								"/",
								async ({ db, query, params, status }) => {
									const invitedUser = await db.query.user.findFirst({
										where: (user, { eq }) => eq(user.email, query.email),
									});
									if (!invitedUser) {
										return status(404);
									}
									await db.insert(schema.member).values({
										orgId: params.orgId,
										id: invitedUser.id,
										role: query.role,
									});
									return status(204);
								},
								{
									beforeHandle: ({ status, member }) => {
										if (member.role !== "admin") {
											return status(401);
										}
									},
									query: t.Object({
										email: model.select.user.email,
										role: model.insert.member.role,
									}),
								},
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
											where: (ch, { eq, and }) =>
												and(
													eq(ch.callId, params.callId),
													eq(ch.memberId, member.id),
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
