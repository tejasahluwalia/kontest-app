import { model } from "@db/model";
import * as schema from "@db/schema";
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
			where: { userId: user.id },
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
				{
					body: t.Object({
						name: model.insert.org.name,
						slug: model.insert.org.slug,
					}),
				},
				async ({ body, user, db }) => {
					const newOrg = await db.insert(schema.org).values(body).returning();
					await db
						.insert(schema.member)
						.values({ orgId: newOrg[0].id, userId: user.id, role: "admin" });
					return newOrg;
				},
			)
			.get("/checkAvailability/:slug", async ({ params, db }) => {
				const existingOrg = await db.query.org.findFirst({
					where: { slug: params.slug },
				});
				const isAvailable = !existingOrg;
				return {
					isAvailable,
				};
			})
			.group("/:orgSlug", (app) =>
				app
					.derive(async ({ params, user, db, status }) => {
						const org = await db.query.org.findFirst({
							where: { slug: params.orgSlug },
						});
						if (!org) {
							return status(404);
						}
						const member = await db.query.member.findFirst({
							where: { orgId: org.id, userId: user.id },
						});
						if (!member) {
							return status(401);
						}
						return { org, member };
					})
					.get("/", async ({ params, db, member }) => {
						const org = await db.query.org.findMany({
							where: { id: member.orgId },
							with: {
								calls: true,
							},
						});
						return org;
					})
					.group("/members", (app) =>
						app
							.get("/", async ({ db, org }) => {
								const members = await db.query.member.findMany({
									where: { orgId: org.id },
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
											{
												body: t.Object({
													role: t.Union([
														t.Literal("admin"),
														t.Literal("member"),
													]),
												}),
											},
											async ({ db, body, params }) => {
												await db
													.update(schema.member)
													.set(body)
													.where(eq(schema.member.id, params.memberId));
												return;
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
										.get("/", async ({ db, org }) => {
											const invites = await db.query.memberInvite.findMany({
												where: { orgId: org.id },
											});
											return invites;
										})
										.post(
											"/",
											{
												body: t.Object({
													email: model.select.user.email,
													role: t.Union([
														t.Literal("admin"),
														t.Literal("member"),
													]),
												}),
											},
											async ({ db, body, status, member, org }) => {
												const userToBeAdded = await db.query.user.findFirst({
													where: { email: body.email },
												});
												if (!userToBeAdded) {
													await db.insert(schema.memberInvite).values({
														orgId: org.id,
														email: body.email,
														invitedBy: member.id,
														role: body.role,
													});
													return status(201);
												}
												await db.insert(schema.member).values({
													orgId: org.id,
													userId: userToBeAdded.id,
													role: body.role,
												});
												return status(204);
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
							.get("/checkAvailability/:slug", async ({ db, params, org }) => {
								const existingCall = await db.query.call.findFirst({
									where: { orgId: org.id, slug: params.slug },
								});
								const isAvailable = !existingCall;
								return {
									isAvailable,
								};
							})
							.post(
								"/",
								{
									body: t.Object({
										name: model.insert.call.name,
										slug: model.insert.call.slug,
									}),
								},
								async ({ body, db, member, org }) => {
									const newCall = await db
										.insert(schema.call)
										.values({ ...body, orgId: org.id })
										.returning();
									await db.insert(schema.callToMember).values({
										callId: newCall[0].id,
										memberId: member.id,
										role: "admin",
									});
									return newCall;
								},
							)
							.group("/:callId", (app) =>
								app
									.derive(async ({ params, status, db, member }) => {
										const callToMember = await db.query.callToMember.findFirst({
											where: {
												callId: params.callId,
												memberId: member.id,
											},
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
										{
											body: t.Object(model.insert.call),
										},
										async ({ body, params, status, db }) => {
											await db
												.update(schema.call)
												.set({
													...body,
													updatedAt: new Date(),
												} as any)
												.where(eq(schema.call.id, params.callId));

											return status(202);
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
													where: { callId },
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
												{
													body: t.Object(model.insert.callToMember),
												},
												async ({ db, body }) => {
													await db.insert(schema.callToMember).values(body);
													return;
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
													{
														body: t.Object({
															name: model.insert.round.name,
															slug: model.insert.round.slug,
															formSchema: model.insert.round.formSchema,
															judgingSchema: model.insert.round.judgingSchema,
														}),
													},
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
												)
												.get("/", async ({ db, params }) => {
													const rounds = await db.query.round.findMany({
														where: { callId: params.callId },
													});
													return rounds;
												})
												.get(
													"/checkAvailability/:slug",
													async ({ db, params }) => {
														const existingRound =
															await db.query.round.findFirst({
																where: {
																	callId: params.callId,
																	slug: params.slug,
																},
															});
														const isAvailable = !existingRound;
														return {
															isAvailable,
														};
													},
												)
												.group("/:roundId", (app) =>
													app
														.derive(async ({ params, db, status }) => {
															const round = await db.query.round.findFirst({
																where: {
																	id: params.roundId,
																	callId: params.callId,
																},
															});
															if (!round) {
																return status(404);
															}
															return { round };
														})
														.get("/", async ({ round }) => round)
														.put(
															"/",
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
