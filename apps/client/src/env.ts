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
 * Reads environment variables from Vite's `import.meta.env`.
 */
function getRawEnv() {
	return {
		VITE_SERVER_URL: import.meta.env.VITE_SERVER_URL ?? "http://localhost:3000",
		VITE_AUTH_URL: import.meta.env.VITE_AUTH_URL ?? "http://localhost:3000",
		MODE: import.meta.env.MODE ?? "development",
		DEV: import.meta.env.DEV ?? true,
		PROD: import.meta.env.PROD ?? false,
	};
}

/**
 * Valibot Schema for validating client environment variables.
 */
const EnvSchema = v.object({
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
	MODE: v.string("MODE must be a string"),
	DEV: v.boolean("DEV must be a boolean"),
	PROD: v.boolean("PROD must be a boolean"),
});

/**
 * Validates, asserts, and freezes the client environment configuration.
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
			`[ENV Configuration Error] Client environment variables failed validation:\n${formattedErrors}`,
		);
	}

	const validated = parseResult.output;

	// Invariant assertions
	assertEnv(
		typeof validated.VITE_SERVER_URL === "string" &&
			validated.VITE_SERVER_URL.length > 0,
		"VITE_SERVER_URL cannot be empty.",
	);

	// If VITE_AUTH_URL is not set, default to VITE_SERVER_URL
	const resolvedAuthUrl = validated.VITE_AUTH_URL || validated.VITE_SERVER_URL;

	assertEnv(
		typeof resolvedAuthUrl === "string" && resolvedAuthUrl.length > 0,
		"Resolved VITE_AUTH_URL cannot be empty.",
	);

	return Object.freeze({
		VITE_SERVER_URL: validated.VITE_SERVER_URL,
		VITE_AUTH_URL: resolvedAuthUrl,
		MODE: validated.MODE,
		DEV: validated.DEV,
		PROD: validated.PROD,
	});
}

/**
 * Type-safe, pre-validated environment object for apps/client.
 */
export const env = createEnv();
export type ClientEnv = typeof env;
