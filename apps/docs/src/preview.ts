import { existsSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT_DIR = resolve(import.meta.dirname, "..");
const DIST_DIR = join(ROOT_DIR, "dist");
const PORT = Number(process.env.PORT || 4173);

if (!existsSync(DIST_DIR)) {
	console.error("❌ dist directory does not exist. Run 'bun run build' first.");
	process.exit(1);
}

const mimeTypes: Record<string, string> = {
	".html": "text/html; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".js": "application/javascript; charset=utf-8",
	".json": "application/json",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".ico": "image/x-icon",
};

Bun.serve({
	port: PORT,
	async fetch(req) {
		const url = new URL(req.url);
		let pathname = url.pathname;

		if (pathname === "/" || pathname === "") {
			pathname = "/index.html";
		}

		let filePath = join(DIST_DIR, pathname);
		if (existsSync(filePath) && statSync(filePath).isDirectory()) {
			filePath = join(filePath, "index.html");
		}

		if (!existsSync(filePath)) {
			// Try .html extension
			if (existsSync(`${filePath}.html`)) {
				filePath = `${filePath}.html`;
			} else {
				return new Response("404 Not Found", { status: 404 });
			}
		}

		const ext = filePath.slice(filePath.lastIndexOf("."));
		const contentType = mimeTypes[ext] || "application/octet-stream";
		return new Response(readFileSync(filePath), {
			headers: { "Content-Type": contentType },
		});
	},
});

console.log(`🚀 Preview server running at http://localhost:${PORT}`);
