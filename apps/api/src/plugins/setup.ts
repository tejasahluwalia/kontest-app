import { db } from "@api/lib/db";
import { Elysia } from "elysia";
import { betterAuth } from "./auth";

export const setup = new Elysia({ name: "setup" })
	.use(betterAuth)
	.decorate("db", db);
