import { model } from "@server/database/model";
import { betterAuth } from "@server/middlewares/auth-middleware";
import { checkCallAvailability, getCallBySlug } from "@server/services/call";
import Elysia, { t } from "elysia";

export const callController = new Elysia({
  name: "callController",
  prefix: "/api/calls",
}).get(
    "/checkAvailability/:slug",
    async ({ params, set }) => {
      const isAvailable = await checkCallAvailability(params.slug);
      return {
        isAvailable,
      };
    },
    { auth: true },
  );
