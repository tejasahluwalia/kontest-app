/**
 * Playwright Headless Chromium E2E Test Suite for Kontest SPA
 *
 * Runs full browser automation, captures screenshots, inspects console logs and errors.
 *
 * Usage:
 *   bun --env-file=.env run ./scripts/e2e-browser.ts
 *   or: bun run test:browser
 */

import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { db } from "../packages/db/src/index";

const CLIENT_URL =
	process.env.CLIENT_URL ||
	process.env.VITE_CLIENT_URL ||
	"http://localhost:5173";
const SCREENSHOT_DIR = resolve(process.cwd(), "artifacts/screenshots");

if (!existsSync(SCREENSHOT_DIR)) {
	mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

interface ConsoleMessageLog {
	type: string;
	text: string;
	location: string;
}

async function runBrowserE2E() {
	console.log("\n=======================================================");
	console.log("  🎭 PLAYWRIGHT HEADLESS CHROMIUM E2E RUNNER");
	console.log("=======================================================\n");

	const consoleLogs: ConsoleMessageLog[] = [];
	const pageErrors: string[] = [];
	const failedRequests: string[] = [];

	console.log("🚀 Launching Headless Chromium...");
	const browser = await chromium.launch({
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});

	const context = await browser.newContext({
		viewport: { width: 1280, height: 800 },
	});
	const page = await context.newPage();

	// 1. Setup diagnostic listeners
	page.on("console", (msg) => {
		const log = {
			type: msg.type(),
			text: msg.text(),
			location: msg.location().url || "inline",
		};
		consoleLogs.push(log);
		if (msg.type() === "error") {
			console.error(`  ⚠️ [Browser Console Error]: ${msg.text()}`);
		}
	});

	page.on("pageerror", (err) => {
		pageErrors.push(err.message);
		console.error(`  🚨 [Uncaught Page Error]: ${err.message}`);
	});

	page.on("requestfailed", (req) => {
		failedRequests.push(
			`${req.method()} ${req.url()} (${req.failure()?.errorText || "failed"})`,
		);
		console.warn(`  ⚠️ [Network Request Failed]: ${req.method()} ${req.url()}`);
	});

	try {
		// -------------------------------------------------------------
		// Step 1: Visit Home Page
		// -------------------------------------------------------------
		console.log(`\n📍 Step 1: Navigating to ${CLIENT_URL}/...`);
		await page.goto(`${CLIENT_URL}/`, { waitUntil: "networkidle" });
		const homeScreenshotPath = resolve(SCREENSHOT_DIR, "01_home_page.png");
		await page.screenshot({ path: homeScreenshotPath, fullPage: true });
		console.log(`  📸 Screenshot saved: ${homeScreenshotPath}`);

		// -------------------------------------------------------------
		// Step 2: Visit Login Page
		// -------------------------------------------------------------
		console.log(`\n📍 Step 2: Navigating to ${CLIENT_URL}/login...`);
		await page.goto(`${CLIENT_URL}/login`, { waitUntil: "networkidle" });
		const loginScreenshotPath = resolve(SCREENSHOT_DIR, "02_login_page.png");
		await page.screenshot({ path: loginScreenshotPath });
		console.log(`  📸 Screenshot saved: ${loginScreenshotPath}`);

		// -------------------------------------------------------------
		// Step 3: Fill Email Form & Request OTP
		// -------------------------------------------------------------
		console.log("\n📍 Step 3: Submitting Name & Email for OTP...");
		const nameInput = page.locator('input[placeholder="name"]');
		const emailInput = page.locator('input[placeholder="me@email.com"]');
		const sendOtpBtn = page.locator('button:has-text("Send OTP")');

		await nameInput.waitFor({ state: "visible", timeout: 5000 });
		await nameInput.fill("Host Admin");
		await emailInput.fill("host@kontest.dev");
		await sendOtpBtn.click();

		// -------------------------------------------------------------
		// Step 4: Retrieve OTP & Enter into OTP Inputs
		// -------------------------------------------------------------
		console.log("\n📍 Step 4: Waiting for OTP stage in client...");
		const otpSubmitBtn = page.locator('button:has-text("Enter OTP")');
		await otpSubmitBtn.waitFor({ state: "visible", timeout: 5000 });

		const otpStepScreenshotPath = resolve(SCREENSHOT_DIR, "03_otp_stage.png");
		await page.screenshot({ path: otpStepScreenshotPath });
		console.log(`  📸 Screenshot saved: ${otpStepScreenshotPath}`);

		// Query database for newest OTP
		console.log("  🔍 Querying verification table in PostgreSQL for OTP...");
		const allVerifications = await db.query.verification.findMany();
		const userVerifications = allVerifications.filter((v) =>
			v.identifier.includes("host@kontest.dev"),
		);
		const latestVerification = userVerifications.sort(
			(a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
		)[0];

		if (!latestVerification) {
			throw new Error(
				"No OTP record found in verification table for host@kontest.dev",
			);
		}

		const otp = latestVerification.value.split(":")[0];
		console.log(`  🔑 Got OTP: ${otp}`);

		// Enter OTP in OTP input
		const otpInput = page.locator('input[name="otp"], input').first();
		await otpInput.focus();
		await page.keyboard.type(otp, { delay: 50 });

		await otpSubmitBtn.click();

		// -------------------------------------------------------------
		// Step 5: Verify Navigation to /host Dashboard
		// -------------------------------------------------------------
		console.log("\n📍 Step 5: Verifying navigation to /host dashboard...");
		await page.waitForURL(/.*\/host.*/, { timeout: 8000 });
		await page.waitForLoadState("networkidle");

		const hostScreenshotPath = resolve(SCREENSHOT_DIR, "04_host_dashboard.png");
		await page.screenshot({ path: hostScreenshotPath, fullPage: true });
		console.log(`  📸 Screenshot saved: ${hostScreenshotPath}`);

		// -------------------------------------------------------------
		// Summary Report
		// -------------------------------------------------------------
		console.log("\n=======================================================");
		console.log("  📊 BROWSER DIAGNOSTIC & CONSOLE AUDIT");
		console.log("=======================================================");
		console.log(`Current URL:          ${page.url()}`);
		console.log(`Total Console Logs:   ${consoleLogs.length}`);
		console.log(
			`Console Errors:       ${consoleLogs.filter((c) => c.type === "error").length}`,
		);
		console.log(`Uncaught Page Errors: ${pageErrors.length}`);
		console.log(`Failed Requests:      ${failedRequests.length}`);
		console.log(`Screenshots Captured: 4`);
		console.log("=======================================================\n");

		if (pageErrors.length > 0) {
			console.error(
				"❌ Browser test failed due to uncaught runtime errors in SPA:",
			);
			for (const err of pageErrors) {
				console.error(`  - ${err}`);
			}
			process.exit(1);
		} else {
			console.log(
				"✨ Browser E2E test completed cleanly with ZERO runtime exceptions!",
			);
			process.exit(0);
		}
	} catch (err) {
		const errScreenshotPath = resolve(SCREENSHOT_DIR, "error_state.png");
		await page.screenshot({ path: errScreenshotPath }).catch(() => {});
		const message = err instanceof Error ? err.message : String(err);
		console.error(`\n❌ Browser test execution failed: ${message}`);
		console.error(
			`📸 Error state screenshot captured at: ${errScreenshotPath}`,
		);
		process.exit(1);
	} finally {
		await browser.close();
	}
}

runBrowserE2E().catch((err) => {
	console.error("Fatal exception in browser runner:", err);
	process.exit(1);
});
