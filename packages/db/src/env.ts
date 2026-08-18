import * as v from "valibot";

/**
 * Assertion utility for environment invariants.
 * Uses TypeScript `asserts condition` to narrow types and fail-fast at startup.
 */
export function assertEnv(
	condition: unknown,
	message: string,
): asserts condition {
	if (!condition) {
		throw new Error(`[ENV Assertion Failed] ${message}`);
	}
}

/**
 * Reads raw environment variables from Bun or Node runtime.
 */
function getRawEnv() {
	const bunEnv = typeof Bun !== "undefined" ? Bun.env : undefined;
	const procEnv = typeof process !== "undefined" ? process.env : undefined;

	return {
		DATABASE_URL:
			bunEnv?.DATABASE_URL ??
			procEnv?.DATABASE_URL ??
			"postgres://user:password@localhost:5432/postgres",
		NODE_ENV: bunEnv?.NODE_ENV ?? procEnv?.NODE_ENV ?? "development",
	};
}

/**
 * Valibot Schema for validating database environment variables.
 */
const EnvSchema = v.object({
	DATABASE_URL: v.pipe(
		v.string("DATABASE_URL must be a string"),
		v.nonEmpty("DATABASE_URL cannot be empty"),
	),
	NODE_ENV: v.optional(
		v.picklist(
			["development", "production", "test"],
			"NODE_ENV must be 'development', 'production', or 'test'",
		),
		"development",
	),
});

/**
 * Validates, asserts, and freezes the database environment configuration.
 */
function createEnv() {
	const raw = getRawEnv();

	const parseResult = v.safeParse(EnvSchema, raw);

	if (!parseResult.success) {
		const formattedErrors = parseResult.issues
			.map(
				(issue) =>
					`  - ${issue.path?.map((p) => p.key).join(".") || "env"}: ${issue.message}`,
			)
			.join("\n");
		throw new Error(
			`[ENV Configuration Error] Database environment variables failed validation:\n${formattedErrors}`,
		);
	}

	const validated = parseResult.output;

	// Invariant assertions
	assertEnv(
		typeof validated.DATABASE_URL === "string" &&
			validated.DATABASE_URL.length > 0,
		"DATABASE_URL cannot be empty.",
	);

	assertEnv(
		validated.DATABASE_URL.startsWith("postgres://") ||
			validated.DATABASE_URL.startsWith("postgresql://"),
		"DATABASE_URL must be a valid PostgreSQL connection URI (e.g. postgres://user:password@localhost:5432/postgres).",
	);

	return Object.freeze({
		DATABASE_URL: validated.DATABASE_URL,
		NODE_ENV: validated.NODE_ENV,
	});
}

/**
 * Type-safe, pre-validated environment object for @kontest/db.
 */
export const env = createEnv();
export type DbEnv = typeof env;
