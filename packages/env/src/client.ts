import * as v from "valibot";
import { createUrlSchema, validateEnv } from "./schema";

/**
 * Valibot Schema for @kontest/client environment variables.
 * Validates only the public client variables required by the frontend application.
 */
export const ClientEnvSchema = v.object({
	VITE_SERVER_URL: createUrlSchema("VITE_SERVER_URL"),
	VITE_AUTH_URL: createUrlSchema("VITE_AUTH_URL"),
});

export type ClientEnv = v.InferOutput<typeof ClientEnvSchema>;

/**
 * Validates and returns client environment configuration.
 * Uses Vite's `import.meta.env` in the browser, or Bun.env in test/CLI environments.
 */
export function createClientEnv(source?: Record<string, unknown>): ClientEnv {
	const raw =
		source ??
		(typeof import.meta !== "undefined" && import.meta.env
			? {
					VITE_SERVER_URL: import.meta.env.VITE_SERVER_URL,
					VITE_AUTH_URL: import.meta.env.VITE_AUTH_URL,
				}
			: {
					VITE_SERVER_URL: Bun.env.VITE_SERVER_URL,
					VITE_AUTH_URL: Bun.env.VITE_AUTH_URL,
				});

	return Object.freeze(validateEnv(ClientEnvSchema, raw, "@kontest/client"));
}

/**
 * Singleton client environment object.
 */
export const clientEnv = createClientEnv();
