import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import betterAuthView from "./lib/auth-view";
import { orgPlugin } from "./plugins/org";
import { callPlugin } from "./plugins/call";
import { setup } from "./plugins/setup";

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
  .group("/api", (api) => {
    return api
      .use(orgPlugin)
      .use(callPlugin)
      .all("/auth/*", betterAuthView);
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
