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
		DOCS_PORT: bunEnv?.DOCS_PORT ?? procEnv?.DOCS_PORT ?? 4000,
		PORT: bunEnv?.PORT ?? procEnv?.PORT ?? 4173,
		NODE_ENV: bunEnv?.NODE_ENV ?? procEnv?.NODE_ENV ?? "development",
	};
}

/**
 * Valibot Schema for validating docs environment variables.
 */
const EnvSchema = v.object({
	DOCS_PORT: v.pipe(
		v.union([v.string(), v.number()], "DOCS_PORT must be a number or string"),
		v.transform((val) => Number(val)),
		v.integer("DOCS_PORT must be an integer"),
		v.minValue(1, "DOCS_PORT must be between 1 and 65535"),
		v.maxValue(65535, "DOCS_PORT must be between 1 and 65535"),
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
});

/**
 * Validates, asserts, and freezes the docs environment configuration.
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
			`[ENV Configuration Error] Docs environment variables failed validation:\n${formattedErrors}`,
		);
	}

	const validated = parseResult.output;

	// Invariant assertions
	assertEnv(
		typeof validated.DOCS_PORT === "number" &&
			!Number.isNaN(validated.DOCS_PORT) &&
			validated.DOCS_PORT >= 1 &&
			validated.DOCS_PORT <= 65535,
		"DOCS_PORT must be a valid port number between 1 and 65535.",
	);

	assertEnv(
		typeof validated.PORT === "number" &&
			!Number.isNaN(validated.PORT) &&
			validated.PORT >= 1 &&
			validated.PORT <= 65535,
		"PORT must be a valid port number between 1 and 65535.",
	);

	return Object.freeze({
		DOCS_PORT: validated.DOCS_PORT,
		PORT: validated.PORT,
		NODE_ENV: validated.NODE_ENV,
	});
}

/**
 * Type-safe, pre-validated environment object for apps/docs.
 */
export const env = createEnv();
export type DocsEnv = typeof env;
