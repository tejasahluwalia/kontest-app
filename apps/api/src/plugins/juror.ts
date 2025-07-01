import Elysia from "elysia";
import { setup } from "./setup";

export const jurorPlugin = new Elysia({
	name: "jurorPlugin",
	prefix: "/juror",
})
	.use(setup)
	.guard({
		mustAuth: true,
	})
	.group("/calls", (app) =>
		app
			.get("/", async ({ db, user }) => {
				const calls = await db.query.juror.findMany({
					where: (juror, { eq }) => eq(juror.id, user.id),
				});
				return calls;
			})
			.group("/:roundId", (app) =>
				app
					.resolve(async ({ db, user, params, status }) => {
						const juror = await db.query.juror.findFirst({
							where: (juror, { eq, and }) =>
								and(eq(juror.id, user.id), eq(juror.roundId, params.roundId)),
							with: {
								judgements: true,
							},
						});
						if (!juror) {
							return status(401);
						}
						return { juror };
					})
					.get("/", async ({ db, juror }) => {
						const submissions = await db.query.submission.findMany({
							where: (s, { eq }) => eq(s.roundId, juror.roundId),
						});
						return { ...juror, submissions };
					})
					.put("/submissions/:submissionId", async ({ db }) => {}),
			),
	);
