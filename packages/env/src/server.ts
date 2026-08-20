import * as v from "valibot";
import {
	buildPostgresUrl,
	createPortSchema,
	createUrlSchema,
	NodeEnvSchema,
	PostgresConfigSchema,
	validateEnv,
} from "./schema";

/**
 * Valibot Schema for @kontest/server environment variables (Bun native).
 * Derives DATABASE_URL dynamically from POSTGRES_* connection components.
 */
export const ServerEnvSchema = v.pipe(
	v.object({
		...PostgresConfigSchema.entries,
		AUTH_SECRET: v.pipe(
			v.string("AUTH_SECRET is required and must be a string"),
			v.minLength(16, "AUTH_SECRET must be at least 16 characters long"),
		),
		PORT: createPortSchema("PORT"),
		NODE_ENV: NodeEnvSchema,
		SERVER_URL: createUrlSchema("SERVER_URL"),
		AUTH_URL: createUrlSchema("AUTH_URL"),
	}),
	v.transform((input) => ({
		...input,
		DATABASE_URL: buildPostgresUrl(input),
	})),
);

export type ServerEnv = v.InferOutput<typeof ServerEnvSchema>;

/**
 * Validates and returns server environment configuration from Bun.env.
 */
export function createServerEnv(
	source: Record<string, unknown> = Bun.env,
): ServerEnv {
	return Object.freeze(validateEnv(ServerEnvSchema, source, "@kontest/server"));
}

/**
 * Singleton server environment object.
 */
export const serverEnv = createServerEnv();
