import { model } from "@server/database/model";
import Elysia, { t } from "elysia";
import { setup } from "./setup";
import { call, callToHost, org, orgToHost } from "@server/database/schema";
import { eq } from "drizzle-orm";

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
				const orgsToHost = await db.query.orgToHost.findMany({
					where: (oh, { eq }) => eq(oh.userId, user.id),
					with: {
						org: {
							with: {
								calls: {
									columns: { id: true, slug: true, name: true },
								},
							},
						},
					},
				});
				const orgs = orgsToHost.map((orgToHost) => {
					return {
						...orgToHost.org,
						role: orgToHost.role,
					};
				});
				return orgs;
			})
			.post(
				"/",
				async ({ body, user, db, redirect }) => {
					const newOrg = await db.insert(org).values(body).returning();
					await db
						.insert(orgToHost)
						.values({ orgId: newOrg[0].id, userId: user.id, role: "admin" });
					return redirect(`http://localhost:5173/host/orgs/${body.slug}`, 302);
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
						const orgToHost = await db.query.orgToHost.findFirst({
							where: (orgToHost, { and, eq }) =>
								and(
									eq(orgToHost.userId, user.id),
									eq(orgToHost.orgId, params.orgId),
								),
							with: {
								org: true,
							},
						});
						if (!orgToHost) {
							return status(401);
						}
						return { orgToHost };
					})
					.get("/", async ({ params, db, orgToHost }) => {
						const calls = await db.query.call.findMany({
							where: (call, { eq }) => eq(call.orgId, params.orgId),
							with: {
								callToParticipant: true,
								submissions: {
									columns: { id: true },
								},
							},
						});
						return {
							...orgToHost.org,
							calls,
						};
					})
					.group("/members", (app) =>
						app
							.get("/", async ({ db, params, status }) => {
								const orgMembers = await db.query.orgToHost.findMany({
									where: (oh, { eq }) => eq(oh.orgId, params.orgId),
									with: {
										user: true,
									},
								});
								return status(200, orgMembers);
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
									await db.insert(orgToHost).values({
										orgId: params.orgId,
										userId: invitedUser.id,
										role: query.role,
									});
									return status(204);
								},
								{
									beforeHandle: ({ status, orgToHost }) => {
										if (orgToHost.role !== "admin") {
											return status(401);
										}
									},
									query: t.Object({
										email: model.select.user.email,
										role: model.insert.orgToHost.role,
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
								async ({ body, user, status, db }) => {
									const newCall = await db
										.insert(call)
										.values(body)
										.returning();
									await db.insert(callToHost).values({
										callId: newCall[0].id,
										userId: user.id,
										visibility: "admin",
									});
									return status(201, newCall[0].id);
								},
								{
									body: t.Object(model.insert.call),
								},
							)
							.group("/:callId", (app) =>
								app
									.resolve(async ({ params, user, db, status }) => {
										const callToHost = await db.query.callToHost.findFirst({
											where: (ch, { eq, and }) =>
												and(
													eq(ch.callId, params.callId),
													eq(ch.userId, user.id),
												),
											with: {
												call: true,
											},
										});
										if (!callToHost) {
											return status(401);
										}
										return {
											callToHost,
										};
									})
									.put(
										"/",
										async ({ body, params, status, db }) => {
											await db
												.insert(call)
												.values({
													...body,
													id: params.callId,
													updatedAt: new Date(),
												})
												.onConflictDoUpdate({
													target: call.id,
													set: { ...body },
												});

											return status(202);
										},
										{
											body: t.Object(model.insert.call),
										},
									)
									.get("/", async ({ callToHost }) => {
										return { ...callToHost.call };
									})
									.delete("/", async ({ db, params, status }) => {
										await db.delete(call).where(eq(call.id, params.callId));
										return status(202);
									}),
							),
					),
			),
	);
