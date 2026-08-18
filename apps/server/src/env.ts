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
		AUTH_SECRET: bunEnv?.AUTH_SECRET ?? procEnv?.AUTH_SECRET ?? "",
		PORT:
			bunEnv?.PORT ??
			bunEnv?.SERVER_PORT ??
			procEnv?.PORT ??
			procEnv?.SERVER_PORT ??
			3000,
		NODE_ENV: bunEnv?.NODE_ENV ?? procEnv?.NODE_ENV ?? "development",
		VITE_SERVER_URL:
			bunEnv?.VITE_SERVER_URL ??
			procEnv?.VITE_SERVER_URL ??
			"http://localhost:3000",
		VITE_AUTH_URL:
			bunEnv?.VITE_AUTH_URL ??
			procEnv?.VITE_AUTH_URL ??
			"http://localhost:3000",
	};
}

/**
 * Valibot Schema for validating server environment variables.
 */
const EnvSchema = v.object({
	DATABASE_URL: v.pipe(
		v.string("DATABASE_URL must be a string"),
		v.nonEmpty("DATABASE_URL cannot be empty"),
	),
	AUTH_SECRET: v.pipe(
		v.string("AUTH_SECRET must be a string"),
		v.minLength(16, "AUTH_SECRET must be at least 16 characters long"),
	),
	PORT: v.pipe(
		v.union([v.string(), v.number()], "PORT must be a number or string"),
		v.transform((val) => Number(val)),
		v.integer("PORT must be an integer"),
		v.minValue(1, "PORT must be between 1 and 65535"),
		v.maxValue(65535, "PORT must be between 1 and 65535"),
	),
	NODE_ENV: v.optional(
		v.picklist(
			["development", "production", "test"],
			"NODE_ENV must be 'development', 'production', or 'test'",
		),
		"development",
	),
	VITE_SERVER_URL: v.pipe(
		v.string("VITE_SERVER_URL must be a string"),
		v.url("VITE_SERVER_URL must be a valid URL (e.g. http://localhost:3000)"),
	),
	VITE_AUTH_URL: v.optional(
		v.pipe(
			v.string("VITE_AUTH_URL must be a string"),
			v.url("VITE_AUTH_URL must be a valid URL (e.g. http://localhost:3000)"),
		),
	),
});

/**
 * Validates, asserts, and freezes the server environment configuration.
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
			`[ENV Configuration Error] Server environment variables failed validation:\n${formattedErrors}`,
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
		"DATABASE_URL must be a valid PostgreSQL connection URI.",
	);

	assertEnv(
		typeof validated.AUTH_SECRET === "string" &&
			validated.AUTH_SECRET.length >= 16,
		"AUTH_SECRET must be at least 16 characters long for security.",
	);

	assertEnv(
		typeof validated.PORT === "number" &&
			!Number.isNaN(validated.PORT) &&
			validated.PORT >= 1 &&
			validated.PORT <= 65535,
		"PORT must be a valid port number between 1 and 65535.",
	);

	// If VITE_AUTH_URL is not set, default to VITE_SERVER_URL
	const resolvedAuthUrl = validated.VITE_AUTH_URL || validated.VITE_SERVER_URL;

	assertEnv(
		typeof resolvedAuthUrl === "string" && resolvedAuthUrl.length > 0,
		"Resolved VITE_AUTH_URL cannot be empty.",
	);

	assertEnv(
		typeof validated.VITE_SERVER_URL === "string" &&
			validated.VITE_SERVER_URL.length > 0,
		"VITE_SERVER_URL cannot be empty.",
	);

	return Object.freeze({
		DATABASE_URL: validated.DATABASE_URL,
		AUTH_SECRET: validated.AUTH_SECRET,
		PORT: validated.PORT,
		NODE_ENV: validated.NODE_ENV,
		VITE_SERVER_URL: validated.VITE_SERVER_URL,
		VITE_AUTH_URL: resolvedAuthUrl,
	});
}

/**
 * Type-safe, pre-validated environment object for apps/server.
 */
export const env = createEnv();
export type ServerEnv = typeof env;
