import { Elysia } from "elysia";
import { betterAuth } from "./auth";
import { db } from "@server/database";

export const setup = new Elysia({ name: "setup" })
    .use(betterAuth)
    .decorate("db", db)
