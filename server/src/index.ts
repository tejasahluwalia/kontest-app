import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import betterAuthView from "./lib/auth-view";
import { setup } from "./plugins/setup";
import { publicPlugin } from "./plugins/public";
import { hostPlugin } from "./plugins/host";
import { jurorPlugin } from "./plugins/juror";

const app = new Elysia()
	.use(
		cors({
			origin: ["http://localhost:5173", "http://localhost:4173"],
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.use(setup)
	.group("/api", (api) =>
		api
			.use(publicPlugin)
			.use(hostPlugin)
			.use(jurorPlugin)
			.all("/auth/*", betterAuthView),
	)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
