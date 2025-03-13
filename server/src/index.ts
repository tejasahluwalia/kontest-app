import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import betterAuthView from "./lib/auth-view";
import { betterAuth } from "./middlewares/auth-middleware";
import { model } from "./database/model";

import {
  checkOrganizationAvailability,
  createOrganization,
  getOrganizationsByUserId,
} from "./services/organization";

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
  .get(
    "/api/organizations",
    async ({ set, user, session, error, ...ctx }) => {
      return await getOrganizationsByUserId(user.id);
    },
    { auth: true },
  )
  .get(
    "/api/organizations/checkAvailability/:slug",
    async ({ set, user, session, error, ...ctx }) => {
      const isAvailable = await checkOrganizationAvailability(ctx.params.slug);
      return {
        isAvailable,
      };
    },
    { auth: true },
  )
  .post(
    "/api/organizations",
    async ({ body, user }) => {
      return await createOrganization(body.name, body.slug, user.id);
    },
    {
      auth: true,
      body: t.Object({
        name: model.insert.organization.name,
        slug: model.insert.organization.slug,
      }),
    },
  )
  .all("/api/auth/*", betterAuthView)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
