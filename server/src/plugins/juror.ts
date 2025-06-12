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
				const calls = await db.query.jurorToCall.findMany({
					where: (jc, { eq }) => eq(jc.userId, user.id),
				});
				return calls;
			})
			.group("/:callId", (app) =>
				app
					.resolve(async ({ db, user, params, status }) => {
						const jurorToCall = await db.query.jurorToCall.findFirst({
							where: (jc, { eq, and }) =>
								and(eq(jc.userId, user.id), eq(jc.callId, params.callId)),
							with: {
								call: {
									columns: {
										schema: false,
									},
								},
							},
						});
						if (!jurorToCall) {
							return status(401);
						}
						return { jurorToCall };
					})
					.get("/", async ({ db, jurorToCall }) => {
						const submissions = await db.query.submission.findMany({
							where: (s, { eq }) => eq(s.callId, jurorToCall?.callId),
						});
						return { ...jurorToCall, submissions };
					})
					.put("/submissions/:submissionId", async ({}) => {}),
			),
	);
