import { treaty } from "@elysia/eden";
import { app } from "@server/index";
import { createFileRoute } from "@tanstack/solid-router";
import { createIsomorphicFn } from "@tanstack/solid-start";

const handle = ({ request }: { request: Request }) => app.fetch(request);

export const Route = createFileRoute("/api/$")({
	server: {
		handlers: {
			GET: handle,
			POST: handle,
			PUT: handle,
			PATCH: handle,
			DELETE: handle,
			OPTIONS: handle,
		},
	},
});

export const getTreaty = createIsomorphicFn()
	.server(() => treaty(app).api)
	.client(
		() =>
			treaty<typeof app>(
				 "http://localhost:5173",
			).api,
	);
