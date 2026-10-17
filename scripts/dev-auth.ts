/**
 * Development & Agent Authentication Helper
 *
 * Usage:
 *   bun run ./scripts/dev-auth.ts [email]
 *
 * Example:
 *   bun run ./scripts/dev-auth.ts host@kontest.dev
 *   bun run ./scripts/dev-auth.ts juror@kontest.dev
 *   bun run ./scripts/dev-auth.ts alice@kontest.dev
 *
 * Returns session token, auth cookies, user object, and sample curl command.
 */

import { db } from "../packages/db/src/index";

const targetEmail = process.argv[2] || "host@kontest.dev";
const serverUrl =
	process.env.SERVER_URL ||
	process.env.VITE_SERVER_URL ||
	"http://localhost:3000";

async function main() {
	console.log(`🔐 Authenticating as: ${targetEmail}`);

	// 1. Check if user exists in database
	const existingUser = await db.query.user.findFirst({
		where: { email: targetEmail },
	});

	if (!existingUser) {
		console.error(
			`❌ User '${targetEmail}' not found in database. Run 'bun db:seed' first.`,
		);
		process.exit(1);
	}

	// 2. Request OTP from server
	const sendRes = await fetch(
		`${serverUrl}/api/auth/email-otp/send-verification-otp`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: targetEmail,
				type: "sign-in",
			}),
		},
	);

	if (!sendRes.ok) {
		const text = await sendRes.text();
		console.error(
			`❌ Failed to request OTP from server: ${sendRes.status} ${text}`,
		);
		process.exit(1);
	}

	// 3. Query the newest generated OTP for this email from the verification table
	const latestVerification = await db.query.verification.findFirst({
		where: { identifier: { like: `%${targetEmail}%` } },
		orderBy: { createdAt: "desc" },
	});

	if (!latestVerification) {
		console.error(
			`❌ No verification token found in database for ${targetEmail}`,
		);
		process.exit(1);
	}

	const rawValue = latestVerification.value;
	const otp = rawValue.split(":")[0];
	console.log(`🔑 Retrieved OTP for ${targetEmail}: ${otp}`);

	// 4. Sign in with OTP
	const signInRes = await fetch(`${serverUrl}/api/auth/sign-in/email-otp`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			email: targetEmail,
			otp,
		}),
	});

	if (!signInRes.ok) {
		const text = await signInRes.text();
		console.error(`❌ Failed to sign in with OTP: ${signInRes.status} ${text}`);
		process.exit(1);
	}

	const cookieHeader = signInRes.headers.get("set-cookie") || "";
	const sessionTokenMatch = cookieHeader.match(
		/better-auth\.session_token=([^;]+)/,
	);
	const sessionToken = sessionTokenMatch ? sessionTokenMatch[1] : "";

	const data = (await signInRes.json()) as {
		user?: { id?: string; name?: string; email?: string };
	};

	console.log("\n================ AUTHENTICATION SUCCESS ================");
	console.log(`User ID:      ${data.user?.id || existingUser.id}`);
	console.log(`User Name:    ${data.user?.name || existingUser.name}`);
	console.log(`User Email:   ${data.user?.email || targetEmail}`);
	console.log(`Session Token:${sessionToken}`);
	console.log(`Cookie:       better-auth.session_token=${sessionToken}`);
	console.log("========================================================\n");

	console.log("Sample cURL command for agents:");
	console.log(
		`curl -H "Cookie: better-auth.session_token=${sessionToken}" ${serverUrl}/api/host\n`,
	);
}

main().catch((err) => {
	console.error("❌ Fatal error in dev-auth:", err);
	process.exit(1);
});
