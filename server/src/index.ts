import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import betterAuthView from "./lib/auth-view";
import { betterAuth } from "./middlewares/auth-middleware";
import { checkContestAvailability } from "./services/contest";
import { organizationController } from "./controllers/organization";


const app = new Elysia()
  .use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:4173"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(betterAuth)
  .use(organizationController)
  .get(
    "/api/contests/checkAvailability/:slug",
    async ({ params, set }) => {
      const isAvailable = await checkContestAvailability(params.slug);
      return {
        isAvailable,
      };
    },
    { auth: true },
  )
  .all("/api/auth/*", betterAuthView)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
