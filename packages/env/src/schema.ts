import * as v from "valibot";

/**
 * Asserts a condition for environment invariant checks.
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
 * Formats Valibot validation issues into a human-readable list.
 */
export function formatValidationIssues(
	issues: Array<{ path?: Array<{ key: unknown }>; message: string }>,
): string {
	return issues
		.map((issue) => {
			const path = issue.path?.map((p) => String(p.key)).join(".") || "env";
			return `  - ${path}: ${issue.message}`;
		})
		.join("\n");
}

/**
 * Validates a raw environment object against a Valibot schema with descriptive error formatting.
 */
export function validateEnv<
	TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(schema: TSchema, rawEnv: Record<string, unknown>, scopeName: string) {
	const parseResult = v.safeParse(schema, rawEnv);

	if (!parseResult.success) {
		const formatted = formatValidationIssues(parseResult.issues);
		throw new Error(
			`[ENV Configuration Error] Environment variables for [${scopeName}] failed validation:\n${formatted}`,
		);
	}

	return parseResult.output as v.InferOutput<TSchema>;
}

/**
 * Strict Node/App Environment Schema for Bun. No fallbacks.
 */
export const NodeEnvSchema = v.picklist(
	["development", "production", "test"],
	"NODE_ENV is required and must be 'development', 'production', or 'test'",
);

/**
 * Strict Port schema with string-to-number transformation. No fallbacks.
 */
export function createPortSchema(fieldName = "PORT") {
	return v.pipe(
		v.union(
			[v.string(), v.number()],
			`${fieldName} is required and must be a number or numeric string`,
		),
		v.transform((val) => Number(val)),
		v.integer(`${fieldName} must be an integer`),
		v.minValue(1, `${fieldName} must be between 1 and 65535`),
		v.maxValue(65535, `${fieldName} must be between 1 and 65535`),
	);
}

/**
 * Strict URL Schema. No fallbacks.
 */
export function createUrlSchema(fieldName: string) {
	return v.pipe(
		v.string(`${fieldName} is required and must be a string`),
		v.nonEmpty(`${fieldName} cannot be empty`),
		v.url(`${fieldName} must be a valid URL (e.g. http://localhost:3000)`),
	);
}

/**
 * Strict PostgreSQL Connection Components Schema.
 */
export const PostgresConfigSchema = v.object({
	POSTGRES_HOST: v.pipe(
		v.string("POSTGRES_HOST is required and must be a string"),
		v.nonEmpty("POSTGRES_HOST cannot be empty"),
	),
	POSTGRES_PORT: createPortSchema("POSTGRES_PORT"),
	POSTGRES_USER: v.pipe(
		v.string("POSTGRES_USER is required and must be a string"),
		v.nonEmpty("POSTGRES_USER cannot be empty"),
	),
	POSTGRES_PASSWORD: v.string(
		"POSTGRES_PASSWORD is required and must be a string",
	),
	POSTGRES_DB: v.pipe(
		v.string("POSTGRES_DB is required and must be a string"),
		v.nonEmpty("POSTGRES_DB cannot be empty"),
	),
});

/**
 * Constructs a full PostgreSQL connection URL from individual parameters.
 */
export function buildPostgresUrl(params: {
	POSTGRES_USER: string;
	POSTGRES_PASSWORD?: string;
	POSTGRES_HOST: string;
	POSTGRES_PORT: number;
	POSTGRES_DB: string;
}): string {
	const auth = params.POSTGRES_PASSWORD
		? `${encodeURIComponent(params.POSTGRES_USER)}:${encodeURIComponent(params.POSTGRES_PASSWORD)}`
		: encodeURIComponent(params.POSTGRES_USER);
	return `postgres://${auth}@${params.POSTGRES_HOST}:${params.POSTGRES_PORT}/${params.POSTGRES_DB}`;
}
