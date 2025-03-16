import { model } from "@server/database/model";
import { betterAuth } from "@server/middlewares/auth-middleware";
import { getContestBySlug } from "@server/services/contest";
import Elysia, { error, t } from "elysia";

export const contestController = new Elysia({
  name: "contestController",
  prefix: "/api/contests",
});
