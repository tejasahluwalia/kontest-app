import { auth } from "@server/lib/auth";
import { Elysia } from "elysia";

export const betterAuth = new Elysia({ name: "better-auth" })
	.mount(auth.handler)
	.macro({
		mustAuth: {
			async derive({ status, request: { headers } }) {
				const session = await auth.api.getSession({
					headers,
				});

				if (!session) return status(401);

				return {
					user: session.user,
					session: session.session,
				};
			},
		},
		maybeAuth: {
			async derive({ request: { headers } }) {
				const session = await auth.api.getSession({
					headers,
				});

				if (!session) return { user: null, session: null };

				return {
					user: session.user,
					session: session.session,
				};
			},
		},
	});
