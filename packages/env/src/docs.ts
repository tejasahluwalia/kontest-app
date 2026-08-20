import * as v from "valibot";
import { createPortSchema, NodeEnvSchema, validateEnv } from "./schema";

/**
 * Valibot Schema for @kontest/docs environment variables (Bun native).
 */
export const DocsEnvSchema = v.object({
	DOCS_PORT: createPortSchema("DOCS_PORT"),
	NODE_ENV: NodeEnvSchema,
});

export type DocsEnv = v.InferOutput<typeof DocsEnvSchema>;

/**
 * Validates and returns docs environment configuration from Bun.env.
 */
export function createDocsEnv(
	source: Record<string, unknown> = Bun.env,
): DocsEnv {
	return Object.freeze(validateEnv(DocsEnvSchema, source, "@kontest/docs"));
}

/**
 * Singleton docs environment object.
 */
export const docsEnv = createDocsEnv();
