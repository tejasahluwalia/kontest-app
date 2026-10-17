import { cors } from "@elysia/cors";
import { Elysia } from "elysia";
import { env } from "./env";
import betterAuthView from "./lib/auth-view";
import { hostPlugin } from "./plugins/host";
import { jurorPlugin } from "./plugins/juror";
import { publicPlugin } from "./plugins/public";
import { setup } from "./plugins/setup";
import { userPlugin } from "./plugins/user";

const corsOrigins = env.CORS_ORIGINS.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

export const app = new Elysia()
	.use(
		cors({
			origin: corsOrigins,
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

const port = env.PORT;

if (import.meta.main) {
	app.listen(port, () => {
		console.log(`🚀 Kontest Elysia server running at http://localhost:${port}`);
	});
}

export type App = typeof app;
export default app;
