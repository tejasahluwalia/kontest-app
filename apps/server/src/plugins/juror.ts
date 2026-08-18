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
					where: { userId: user.id },
				});
				return calls;
			})
			.group("/:roundId", (app) =>
				app
					.derive(async ({ db, user, params, status }) => {
						const juror = await db.query.juror.findFirst({
							where: {
								userId: user.id,
								roundId: params.roundId,
							},
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
							where: { roundId: juror.roundId },
						});
						return { ...juror, submissions };
					})
					.put("/submissions/:submissionId", async ({ db }) => {}),
			),
	);
