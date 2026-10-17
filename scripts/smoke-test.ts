/**
 * Autonomous Smoke Test & Healthcheck Suite for Kontest Monorepo
 *
 * Runs comprehensive end-to-end checks across DB, API, Auth, Client, and Docs.
 *
 * Usage:
 *   bun --env-file=.env run ./scripts/smoke-test.ts
 *   or: bun run test:smoke
 */

import { db } from "../packages/db/src/index";

const SERVER_URL =
	process.env.SERVER_URL ||
	process.env.VITE_SERVER_URL ||
	"http://localhost:3000";
const CLIENT_URL =
	process.env.CLIENT_URL ||
	process.env.VITE_CLIENT_URL ||
	"http://localhost:5173";
const DOCS_URL = `http://localhost:${process.env.DOCS_PORT || 4000}`;

interface TestResult {
	name: string;
	status: "PASS" | "FAIL" | "WARN";
	durationMs: number;
	details?: string;
}

const results: TestResult[] = [];

async function runCheck(
	name: string,
	fn: () => Promise<string | undefined>,
	critical = true,
) {
	const start = performance.now();
	try {
		const details = (await fn()) || undefined;
		const durationMs = Math.round(performance.now() - start);
		results.push({ name, status: "PASS", durationMs, details });
		console.log(`  ✓ [PASS] ${name} (${durationMs}ms)`);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		const durationMs = Math.round(performance.now() - start);
		results.push({
			name,
			status: critical ? "FAIL" : "WARN",
			durationMs,
			details: message,
		});
		console.error(
			`  ✗ [${critical ? "FAIL" : "WARN"}] ${name} (${durationMs}ms): ${message}`,
		);
	}
}

async function main() {
	console.log("\n=======================================================");
	console.log("  🚀 KONTEST MONOREPO SMOKE TEST & HEALTHCHECK");
	console.log("=======================================================\n");

	let sessionToken = "";
	let testUserCookie = "";

	// ----------------------------------------------------------------------
	// 1. Database Connection & Schema Check
	// ----------------------------------------------------------------------
	console.log("📦 1. Database & Schema Verification");
	await runCheck("PostgreSQL Connectivity & Tables", async () => {
		const users = await db.query.user.findMany({ limit: 5 });
		const orgs = await db.query.org.findMany({ limit: 5 });
		const calls = await db.query.call.findMany({ limit: 5 });

		if (users.length === 0 || orgs.length === 0 || calls.length === 0) {
			throw new Error(
				"Database is reachable but missing seed data. Run 'bun db:seed' first.",
			);
		}
		return `Found ${users.length} users, ${orgs.length} orgs, ${calls.length} calls`;
	});

	// ----------------------------------------------------------------------
	// 2. Server Health Check
	// ----------------------------------------------------------------------
	console.log("\n🔌 2. Server API Health");
	await runCheck("GET / (Root Server Health)", async () => {
		const res = await fetch(`${SERVER_URL}/`);
		if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
		const json = (await res.json()) as {
			status?: string;
			name?: string;
			version?: string;
		};
		if (json.status !== "ok" || json.name !== "kontest-server") {
			throw new Error(`Unexpected payload: ${JSON.stringify(json)}`);
		}
		return `Server status: ${json.status} (v${json.version})`;
	});

	// ----------------------------------------------------------------------
	// 3. Public Endpoints
	// ----------------------------------------------------------------------
	console.log("\n🌐 3. Public API Endpoints");
	await runCheck("GET /api/calls (Public Calls List)", async () => {
		const res = await fetch(`${SERVER_URL}/api/calls`);
		if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
		const calls = (await res.json()) as Array<{
			id: string;
			slug: string;
			name: string;
		}>;
		if (!Array.isArray(calls) || calls.length === 0) {
			throw new Error("Expected at least one public call");
		}
		return `Returned ${calls.length} public call(s)`;
	});

	await runCheck("GET /api/calls/:id (Public Call Details)", async () => {
		const res = await fetch(`${SERVER_URL}/api/calls/call_global_ai_2026`);
		if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
		const call = (await res.json()) as { slug: string; name: string };
		if (call.slug !== "global-ai-hackathon-2026") {
			throw new Error(
				`Expected slug global-ai-hackathon-2026, got ${call.slug}`,
			);
		}
		return `Verified call '${call.name}'`;
	});

	await runCheck("GET /api/calls/:id (Private Call Guard)", async () => {
		const res = await fetch(`${SERVER_URL}/api/calls/call_private_pitch`);
		if (res.status !== 401) {
			throw new Error(
				`Expected status 401 for unauthenticated private call access, got ${res.status}`,
			);
		}
		return "Correctly blocked unauthenticated access with 401";
	});

	// ----------------------------------------------------------------------
	// 4. Authentication & Session Flow
	// ----------------------------------------------------------------------
	console.log("\n🔑 4. Authentication & Session Management");
	const testEmail = "host@kontest.dev";

	await runCheck("POST /api/auth/email-otp/send-verification-otp", async () => {
		const res = await fetch(
			`${SERVER_URL}/api/auth/email-otp/send-verification-otp`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: testEmail,
					type: "sign-in",
				}),
			},
		);
		if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
		const json = (await res.json()) as { success?: boolean };
		if (!json.success) throw new Error("Expected success: true");
		return `OTP requested for ${testEmail}`;
	});

	await runCheck("POST /api/auth/sign-in/email-otp (OTP Login)", async () => {
		const allVerifications = await db.query.verification.findMany();
		const userVerifications = allVerifications.filter((v) =>
			v.identifier.includes(testEmail),
		);
		const latestVerification = userVerifications.sort(
			(a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
		)[0];

		if (!latestVerification) {
			throw new Error(`No OTP found in verification table for ${testEmail}`);
		}

		const otp = latestVerification.value.split(":")[0];

		const res = await fetch(`${SERVER_URL}/api/auth/sign-in/email-otp`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: testEmail,
				otp,
			}),
		});

		if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);

		const setCookie = res.headers.get("set-cookie") || "";
		const tokenMatch = setCookie.match(/better-auth\.session_token=([^;]+)/);
		if (!tokenMatch) {
			throw new Error("Missing better-auth.session_token in set-cookie header");
		}

		sessionToken = tokenMatch[1];
		testUserCookie = `better-auth.session_token=${sessionToken}`;
		const json = (await res.json()) as {
			user?: { name?: string; email?: string };
		};
		return `Logged in as '${json.user?.name}' (${json.user?.email})`;
	});

	await runCheck(
		"GET /api/auth/get-session (Verify Active Session)",
		async () => {
			const res = await fetch(`${SERVER_URL}/api/auth/get-session`, {
				headers: { Cookie: testUserCookie },
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
			const json = (await res.json()) as {
				user?: { id: string };
				session?: { id: string };
			};
			if (!json.user || !json.session) {
				throw new Error("Invalid session response payload");
			}
			return `Active session verified for user ID ${json.user.id}`;
		},
	);

	await runCheck("PATCH /api/user/me (Update User Profile)", async () => {
		const res = await fetch(`${SERVER_URL}/api/user/me`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Cookie: testUserCookie,
			},
			body: JSON.stringify({
				name: "Host Admin (Verified Agent)",
				email: testEmail,
			}),
		});
		if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
		return "Profile updated successfully";
	});

	// ----------------------------------------------------------------------
	// 5. Host & Protected APIs
	// ----------------------------------------------------------------------
	console.log("\n🏢 5. Protected Host Management APIs");
	await runCheck(
		"GET /api/host (Host Organizations & Calls Hierarchy)",
		async () => {
			const res = await fetch(`${SERVER_URL}/api/host`, {
				headers: { Cookie: testUserCookie },
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
			const memberProfiles = (await res.json()) as Array<{
				org?: { name?: string };
			}>;
			if (!Array.isArray(memberProfiles) || memberProfiles.length === 0) {
				throw new Error("Expected at least one host org membership");
			}
			const orgNames = memberProfiles
				.map((m) => m.org?.name)
				.filter(Boolean)
				.join(", ");
			return `Managed orgs: ${orgNames}`;
		},
	);

	await runCheck(
		"GET /api/host/orgs/:slug/members (Org Members List)",
		async () => {
			const res = await fetch(
				`${SERVER_URL}/api/host/orgs/acme-innovations/members`,
				{
					headers: { Cookie: testUserCookie },
				},
			);
			if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
			const members = (await res.json()) as Array<{ id: string }>;
			return `Found ${members.length} member(s) in acme-innovations`;
		},
	);

	await runCheck("GET /api/host/orgs/checkAvailability/:slug", async () => {
		const testSlug = `test-org-${Date.now()}`;
		const res = await fetch(
			`${SERVER_URL}/api/host/orgs/checkAvailability/${testSlug}`,
			{
				headers: { Cookie: testUserCookie },
			},
		);
		if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
		const json = (await res.json()) as { isAvailable?: boolean };
		if (json.isAvailable !== true) {
			throw new Error(`Expected isAvailable to be true for ${testSlug}`);
		}
		return `Slug '${testSlug}' availability confirmed`;
	});

	// ----------------------------------------------------------------------
	// 6. Client Frontend SSR & Routing
	// ----------------------------------------------------------------------
	console.log("\n💻 6. Client Frontend Application");
	await runCheck(
		`GET ${CLIENT_URL}/ (Client Root)`,
		async () => {
			const res = await fetch(`${CLIENT_URL}/`, {
				headers: { Accept: "text/html" },
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
			const html = await res.text();
			if (!html.includes("html") && !html.includes("script")) {
				throw new Error("Client did not return valid HTML content");
			}
			return "Vite SolidJS client responded with valid HTML";
		},
		false,
	);

	await runCheck(
		`GET ${CLIENT_URL}/login (Client Login Route)`,
		async () => {
			const res = await fetch(`${CLIENT_URL}/login`, {
				headers: { Accept: "text/html" },
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
			return "Login route rendered successfully";
		},
		false,
	);

	// ----------------------------------------------------------------------
	// 7. Docs & Marketing SSG Site
	// ----------------------------------------------------------------------
	console.log("\n📚 7. Docs & Marketing Platform");
	await runCheck(
		`GET ${DOCS_URL}/ (Docs Landing Page)`,
		async () => {
			const res = await fetch(`${DOCS_URL}/`);
			if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
			const html = await res.text();
			if (!html.includes("Kontest")) {
				throw new Error("Landing page does not contain Kontest brand title");
			}
			return "Docs landing page served successfully";
		},
		false,
	);

	await runCheck(
		`GET ${DOCS_URL}/docs/getting-started.html (Rendered Documentation Page)`,
		async () => {
			const res = await fetch(`${DOCS_URL}/docs/getting-started.html`);
			if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
			const html = await res.text();
			if (!html.includes("Getting Started")) {
				throw new Error("Docs page content missing");
			}
			return "Markdown SSG documentation page rendered successfully";
		},
		false,
	);

	// ----------------------------------------------------------------------
	// Summary & Exit Status
	// ----------------------------------------------------------------------
	console.log("\n=======================================================");
	console.log("  📊 SMOKE TEST SUMMARY");
	console.log("=======================================================");

	const passed = results.filter((r) => r.status === "PASS").length;
	const failed = results.filter((r) => r.status === "FAIL").length;
	const warned = results.filter((r) => r.status === "WARN").length;
	const totalDuration = results.reduce((acc, r) => acc + r.durationMs, 0);

	console.log(`Total Checks: ${results.length}`);
	console.log(`Passed:       ${passed}`);
	console.log(`Warnings:     ${warned}`);
	console.log(`Failed:       ${failed}`);
	console.log(`Total Time:   ${totalDuration}ms`);
	console.log("=======================================================\n");

	if (failed > 0) {
		console.error(
			"❌ Some smoke tests failed. Please review the output above.",
		);
		process.exit(1);
	} else {
		console.log(
			"✨ All smoke tests passed! Repo is healthy and ready for agent development loops.",
		);
		process.exit(0);
	}
}

main().catch((err) => {
	console.error("❌ Uncaught exception in smoke test runner:", err);
	process.exit(1);
});
