import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import betterAuthView from "./lib/auth-view";
import { hostPlugin } from "./plugins/host";
import { jurorPlugin } from "./plugins/juror";
import { publicPlugin } from "./plugins/public";
import { setup } from "./plugins/setup";

const app = new Elysia()
	.use(
		cors({
			origin: [
				"http://localhost:5173",
				"http://localhost:4173",
				"http://192.168.1.15:5173",
			],
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
