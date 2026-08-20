import * as v from "valibot";
import {
	buildPostgresUrl,
	NodeEnvSchema,
	PostgresConfigSchema,
	validateEnv,
} from "./schema";

/**
 * Valibot Schema for @kontest/db environment variables (Bun native).
 * Derives DATABASE_URL dynamically from POSTGRES_* connection components.
 */
export const DbEnvSchema = v.pipe(
	v.object({
		...PostgresConfigSchema.entries,
		NODE_ENV: NodeEnvSchema,
	}),
	v.transform((input) => ({
		...input,
		DATABASE_URL: buildPostgresUrl(input),
	})),
);

export type DbEnv = v.InferOutput<typeof DbEnvSchema>;

/**
 * Validates and returns database environment configuration from Bun.env.
 */
export function createDbEnv(source: Record<string, unknown> = Bun.env): DbEnv {
	return Object.freeze(validateEnv(DbEnvSchema, source, "@kontest/db"));
}

/**
 * Singleton database environment object.
 */
export const dbEnv = createDbEnv();
