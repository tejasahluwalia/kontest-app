/**
 * Native Chrome DevTools Protocol (CDP) Runner
 *
 * Connects directly to Headless Chrome via WebSocket CDP endpoint (http://127.0.0.1:9222).
 *
 * Controls Page, Runtime, DOM, Log, and Network domains via raw CDP JSON-RPC.
 *
 * Usage:
 *   bun run ./scripts/cdp-runner.ts
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SCREENSHOT_DIR = resolve(process.cwd(), "artifacts/screenshots");
if (!existsSync(SCREENSHOT_DIR)) {
	mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

interface CdpConsoleParam {
	type: string;
	args?: Array<{ value?: string }>;
}

interface CdpNetworkParam {
	request: {
		url: string;
		method: string;
	};
}

interface CdpMessage {
	id?: number;
	method?: string;
	params?: {
		type?: string;
		args?: Array<{ value?: string }>;
		request?: { url: string; method: string };
	};
	result?: Record<string, unknown>;
	error?: { message?: string; code?: number };
}

interface CdpTarget {
	type: string;
	webSocketDebuggerUrl: string;
}

interface CdpMetric {
	name: string;
	value: number;
}

class CdpClient {
	private ws!: WebSocket;
	private msgId = 0;
	private pending = new Map<
		number,
		{
			resolve: (val: Record<string, unknown> | undefined) => void;
			reject: (err: Error) => void;
		}
	>();
	public consoleLogs: CdpConsoleParam[] = [];
	public networkRequests: CdpNetworkParam["request"][] = [];

	async connect(wsUrl: string) {
		return new Promise<void>((resolve, reject) => {
			this.ws = new WebSocket(wsUrl);
			this.ws.onopen = () => resolve();
			this.ws.onerror = (err) =>
				reject(err instanceof Error ? err : new Error(String(err)));
			this.ws.onmessage = (event) => {
				const data = JSON.parse(event.data.toString()) as CdpMessage;

				// Handle events
				if (data.method === "Runtime.consoleAPICalled" && data.params) {
					this.consoleLogs.push(data.params);
					const args = (data.params.args || []).map((a) => a.value).join(" ");
					console.log(`  [CDP Console] ${data.params.type}: ${args}`);
				}
				if (
					data.method === "Network.requestWillBeSent" &&
					data.params?.request
				) {
					this.networkRequests.push(data.params.request);
				}

				// Handle method responses
				if (data.id && this.pending.has(data.id)) {
					const pendingEntry = this.pending.get(data.id);
					this.pending.delete(data.id);
					if (pendingEntry) {
						if (data.error) {
							pendingEntry.reject(
								new Error(data.error.message || JSON.stringify(data.error)),
							);
						} else {
							pendingEntry.resolve(data.result);
						}
					}
				}
			};
		});
	}

	async send<T = Record<string, unknown>>(
		method: string,
		params: Record<string, unknown> = {},
	): Promise<T> {
		const id = ++this.msgId;
		const payload = JSON.stringify({ id, method, params });
		return new Promise((resolve, reject) => {
			this.pending.set(id, {
				resolve: (val) => resolve(val as T),
				reject,
			});
			this.ws.send(payload);
		});
	}

	close() {
		this.ws.close();
	}
}

async function main() {
	console.log("\n=======================================================");
	console.log("  ⚡ CHROME DEVTOOLS PROTOCOL (CDP) DIRECT RUNNER");
	console.log("=======================================================\n");

	// 1. Fetch CDP version & target info
	console.log(
		"🔍 Fetching CDP targets from http://127.0.0.1:9222/json/list...",
	);
	const targetsRes = await fetch("http://127.0.0.1:9222/json/list");
	const targets = (await targetsRes.json()) as CdpTarget[];

	let pageTarget = targets.find((t) => t.type === "page");
	if (!pageTarget) {
		console.log(
			"Creating new target page via CDP http://127.0.0.1:9222/json/new...",
		);
		const newRes = await fetch(
			"http://127.0.0.1:9222/json/new?http://localhost:5173/login",
			{ method: "PUT" },
		);
		pageTarget = (await newRes.json()) as CdpTarget;
	}

	const wsUrl = pageTarget.webSocketDebuggerUrl;
	console.log(`🔌 Connecting to CDP WebSocket: ${wsUrl}`);

	const cdp = new CdpClient();
	await cdp.connect(wsUrl);
	console.log("✓ Connected to Chrome DevTools Protocol session!");

	// 2. Enable CDP Domains
	console.log("\n⚙️ Enabling CDP domains: Page, Runtime, Network, DOM, Log...");
	await cdp.send("Page.enable");
	await cdp.send("Runtime.enable");
	await cdp.send("Network.enable");
	await cdp.send("DOM.enable");
	await cdp.send("Log.enable");

	// 3. Navigate to Client Login Page
	console.log("\n📍 CDP Command: Page.navigate -> http://localhost:5173/login");
	await cdp.send("Page.navigate", { url: "http://localhost:5173/login" });

	// Wait 1.5s for hydration
	await new Promise((r) => setTimeout(r, 1500));

	// 4. Capture Login Screenshot via Page.captureScreenshot
	console.log("📸 CDP Command: Page.captureScreenshot (Login Page)...");
	const screenshot1 = await cdp.send<{ data: string }>(
		"Page.captureScreenshot",
		{
			format: "png",
		},
	);
	const path1 = resolve(SCREENSHOT_DIR, "cdp_01_login.png");
	writeFileSync(path1, Buffer.from(screenshot1.data, "base64"));
	console.log(`  ✓ Screenshot saved: ${path1}`);

	// 5. Evaluate JavaScript & Fill Login Form via Runtime.evaluate
	console.log(
		"\n⌨️ CDP Command: Runtime.evaluate (Fill form with Host Admin)...",
	);
	const evalResult = await cdp.send<{
		result?: { value?: { success: boolean; error?: string } };
	}>("Runtime.evaluate", {
		expression: `
			(() => {
				const nameInput = document.querySelector('input[placeholder="name"]');
				const emailInput = document.querySelector('input[placeholder="me@email.com"]');
				const submitBtn = document.querySelector('button[type="submit"]');

				if (!nameInput || !emailInput || !submitBtn) {
					return { success: false, error: "Form inputs not found" };
				}

				nameInput.value = "Host Admin";
				nameInput.dispatchEvent(new Event('input', { bubbles: true }));

				emailInput.value = "host@kontest.dev";
				emailInput.dispatchEvent(new Event('input', { bubbles: true }));

				submitBtn.click();
				return { success: true };
			})()
		`,
		returnByValue: true,
	});
	console.log("  ✓ Evaluation Result:", evalResult.result?.value);

	// Wait 1.5s for OTP stage
	await new Promise((r) => setTimeout(r, 1500));

	// 6. Capture OTP Stage Screenshot via Page.captureScreenshot
	console.log("📸 CDP Command: Page.captureScreenshot (OTP Stage)...");
	const screenshot2 = await cdp.send<{ data: string }>(
		"Page.captureScreenshot",
		{
			format: "png",
		},
	);
	const path2 = resolve(SCREENSHOT_DIR, "cdp_02_otp_stage.png");
	writeFileSync(path2, Buffer.from(screenshot2.data, "base64"));
	console.log(`  ✓ Screenshot saved: ${path2}`);

	// 7. Extract Title and Document via DOM.getDocument & Runtime.evaluate
	const titleResult = await cdp.send<{ result?: { value?: string } }>(
		"Runtime.evaluate",
		{
			expression: "document.title + ' | ' + window.location.href",
			returnByValue: true,
		},
	);
	console.log(`  📄 Active Document via CDP: ${titleResult.result?.value}`);

	// 8. Performance Metrics via Performance.getMetrics
	console.log("\n⚡ CDP Command: Performance.getMetrics...");
	await cdp.send("Performance.enable");
	const metrics = await cdp.send<{ metrics: CdpMetric[] }>(
		"Performance.getMetrics",
	);
	const jsHeapUsed =
		metrics.metrics.find((m) => m.name === "JSHeapUsedSize")?.value || 0;
	const domNodes = metrics.metrics.find((m) => m.name === "Nodes")?.value || 0;
	console.log(`  - JS Heap Used: ${(jsHeapUsed / 1024 / 1024).toFixed(2)} MB`);
	console.log(`  - Active DOM Nodes: ${domNodes}`);

	cdp.close();

	console.log("\n=======================================================");
	console.log("  ✨ CHROME DEVTOOLS PROTOCOL (CDP) EXECUTION COMPLETE");
	console.log("=======================================================\n");
}

main().catch((err) => {
	console.error("❌ Fatal error in CDP runner:", err);
	process.exit(1);
});
