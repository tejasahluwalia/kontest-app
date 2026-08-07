import { cors } from "@elysia/cors";
import { staticPlugin } from "@elysia/static";
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
	);

export type App = typeof app;
