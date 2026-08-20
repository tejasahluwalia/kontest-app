import { describe, expect, it } from "bun:test";
import { app } from "../index";
import { db } from "../lib/db";

describe("@kontest/server API Endpoints", () => {
	it("GET / returns server status and version", async () => {
		const res = await app.handle(new Request("http://localhost:3000/"));
		expect(res.status).toBe(200);

		const json = (await res.json()) as any;
		expect(json.status).toBe("ok");
		expect(json.name).toBe("kontest-server");
	});

	it("GET /api/calls returns public calls array", async () => {
		const res = await app.handle(
			new Request("http://localhost:3000/api/calls"),
		);
		expect(res.status).toBe(200);

		const calls = (await res.json()) as any[];
		expect(Array.isArray(calls)).toBe(true);
		expect(calls.length).toBeGreaterThan(0);
	});

	it("GET /api/calls/:id denies unauthenticated access to private calls", async () => {
		const res = await app.handle(
			new Request("http://localhost:3000/api/calls/call_private_pitch"),
		);
		expect(res.status).toBe(401);
	});

	it("handles full OTP auth lifecycle", async () => {
		const testEmail = "host@kontest.dev";

		// 1. Request OTP
		const sendRes = await app.handle(
			new Request(
				"http://localhost:3000/api/auth/email-otp/send-verification-otp",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						email: testEmail,
						type: "sign-in",
					}),
				},
			),
		);
		expect(sendRes.status).toBe(200);

		// 2. Fetch OTP from DB
		const verifications = await db.query.verification.findMany();
		const userVerifications = verifications.filter((v) =>
			v.identifier.includes(testEmail),
		);
		const latestVerification = userVerifications.sort(
			(a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
		)[0];

		expect(latestVerification).toBeDefined();
		const otp = latestVerification.value.split(":")[0];

		// 3. Sign in with OTP
		const signInRes = await app.handle(
			new Request("http://localhost:3000/api/auth/sign-in/email-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: testEmail,
					otp,
				}),
			}),
		);
		expect(signInRes.status).toBe(200);

		const setCookie = signInRes.headers.get("set-cookie") || "";
		const tokenMatch = setCookie.match(/better-auth\.session_token=([^;]+)/);
		expect(tokenMatch).toBeDefined();

		const sessionCookie = `better-auth.session_token=${tokenMatch![1]}`;

		// 4. Verify session
		const sessionRes = await app.handle(
			new Request("http://localhost:3000/api/auth/get-session", {
				headers: { Cookie: sessionCookie },
			}),
		);
		expect(sessionRes.status).toBe(200);
		const sessionJson = (await sessionRes.json()) as any;
		expect(sessionJson.user.email).toBe(testEmail);

		// 5. Test protected host route
		const hostRes = await app.handle(
			new Request("http://localhost:3000/api/host", {
				headers: { Cookie: sessionCookie },
			}),
		);
		expect(hostRes.status).toBe(200);
		const hostProfiles = (await hostRes.json()) as any[];
		expect(hostProfiles.length).toBeGreaterThan(0);
	});
});
