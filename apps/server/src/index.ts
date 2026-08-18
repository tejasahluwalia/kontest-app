import { cors } from "@elysia/cors";
import { Elysia } from "elysia";
import betterAuthView from "./lib/auth-view";
import { hostPlugin } from "./plugins/host";
import { jurorPlugin } from "./plugins/juror";
import { publicPlugin } from "./plugins/public";
import { setup } from "./plugins/setup";
import { userPlugin } from "./plugins/user";

export const app = new Elysia()
	.use(
		cors({
			origin: true,
			methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.use(setup)
	.group("/api", (api) =>
		api
			.use(publicPlugin)
			.use(userPlugin)
			.use(hostPlugin)
			.use(jurorPlugin)
			.all("/auth/*", betterAuthView),
	)
	.get("/", () => ({ status: "ok", name: "kontest-server", version: "0.0.0" }));

const port = Number(process.env.PORT || process.env.SERVER_PORT || 3000);

if (import.meta.main) {
	app.listen(port, () => {
		console.log(`🚀 Kontest Elysia server running at http://localhost:${port}`);
	});
}

export type App = typeof app;
export default app;
