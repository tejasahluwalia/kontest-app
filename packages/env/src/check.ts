import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import * as v from "valibot";
import { ClientEnvSchema } from "./client";
import { DbEnvSchema } from "./db";
import { DocsEnvSchema } from "./docs";
import { ServerEnvSchema } from "./server";

export const DEFAULT_ENV_TEMPLATE = `# ==========================================
# KONTEST MONOREPO ENVIRONMENT CONFIGURATION
# ==========================================

# --- Node & Runtime Environment ---
NODE_ENV=development

# --- Database & PostgreSQL (packages/db & Docker) ---
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=postgres

# --- Backend Server & BetterAuth (apps/server) ---
PORT=3000
SERVER_URL=http://localhost:3000
AUTH_URL=http://localhost:3000
AUTH_SECRET=kontest_dev_super_secret_key_1234567890

# --- Frontend Client (apps/client - Vite) ---
VITE_SERVER_URL=http://localhost:3000
VITE_AUTH_URL=http://localhost:3000

# --- Documentation Site (apps/docs) ---
DOCS_PORT=4000
`;

/**
 * Validates all environment schemas against currently loaded Bun.env.
 */
export function checkAllEnv(rawEnv: Record<string, unknown> = Bun.env) {
	const scopes = [
		{ name: "@kontest/db", schema: DbEnvSchema },
		{ name: "@kontest/server", schema: ServerEnvSchema },
		{ name: "@kontest/client", schema: ClientEnvSchema },
		{ name: "@kontest/docs", schema: DocsEnvSchema },
	];

	const results: Array<{
		scope: string;
		success: boolean;
		issues?: string[];
	}> = [];

	for (const { name, schema } of scopes) {
		const parsed = v.safeParse(schema, rawEnv);
		if (parsed.success) {
			results.push({ scope: name, success: true });
		} else {
			const issues = parsed.issues.map((i) => {
				const path = i.path?.map((p) => String(p.key)).join(".") || "env";
				return `${path}: ${i.message}`;
			});
			results.push({ scope: name, success: false, issues });
		}
	}

	return results;
}

/**
 * CLI Runner when executed directly with Bun.
 */
export async function runCli() {
	const rootDir = resolve(import.meta.dirname, "../../../");
	const envFile = resolve(rootDir, ".env");
	const envExampleFile = resolve(rootDir, ".env.example");

	const args = process.argv.slice(2);
	const isExampleMode = args.includes("--example");
	const isSyncMode = args.includes("--sync");

	console.log("\n=======================================================");
	console.log("  🌿 KONTEST ENVIRONMENT CHECK & SYNC (BUN NATIVE)");
	console.log("=======================================================");

	// 1. Generate or verify .env.example
	if (isExampleMode || !existsSync(envExampleFile)) {
		writeFileSync(envExampleFile, DEFAULT_ENV_TEMPLATE, "utf-8");
		console.log("  ✓ Created/Updated .env.example template file.");
	}

	// 2. Sync mode: Copy .env.example to .env if .env doesn't exist
	if (!existsSync(envFile)) {
		if (isSyncMode) {
			writeFileSync(envFile, DEFAULT_ENV_TEMPLATE, "utf-8");
			console.log("  ✓ Copied .env.example to .env for local development.");
		} else {
			console.warn("  ⚠️  No .env file found at monorepo root.");
			console.log(
				"     Run 'bun env:sync' or 'cp .env.example .env' to create one.\n",
			);
		}
	}

	// 3. Perform schema validation
	const results = checkAllEnv(Bun.env);
	let hasErrors = false;

	for (const res of results) {
		if (res.success) {
			console.log(`  ✓ [VALID] ${res.scope}`);
		} else {
			hasErrors = true;
			console.error(`  ✗ [INVALID] ${res.scope}:`);
			for (const issue of res.issues || []) {
				console.error(`      - ${issue}`);
			}
		}
	}

	console.log("\n=======================================================");
	if (hasErrors) {
		console.error("  ❌ Environment validation failed. Check issues above.");
		console.log("=======================================================\n");
		process.exit(1);
	} else {
		console.log("  ✅ All environment configurations are valid!");
		console.log("=======================================================\n");
	}
}

if (import.meta.main) {
	runCli().catch((err) => {
		console.error("Fatal error during env check:", err);
		process.exit(1);
	});
}
