import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { renderToString } from "./lib/jsx";
import {
	type DocFrontmatter,
	type ParsedMarkdown,
	parseMarkdown,
} from "./lib/markdown";
import { DocPage } from "./pages/DocPage";
import { LandingPage } from "./pages/LandingPage";

const ROOT_DIR = resolve(import.meta.dirname, "..");
const CONTENT_DIR = join(ROOT_DIR, "content/docs");
const PUBLIC_DIR = join(ROOT_DIR, "public");
const PORT = Number(process.env.DOCS_PORT || 4000);

function getAllDocs(): ParsedMarkdown[] {
	if (!existsSync(CONTENT_DIR)) return [];
	const mdFiles = readdirSync(CONTENT_DIR).filter((file) =>
		file.endsWith(".md"),
	);
	const parsedDocs: ParsedMarkdown[] = [];

	for (const file of mdFiles) {
		const filePath = join(CONTENT_DIR, file);
		const rawContent = readFileSync(filePath, "utf-8");
		const slug = file.replace(/\.md$/, "");
		parsedDocs.push(parseMarkdown(rawContent, slug));
	}
	return parsedDocs;
}

const server = Bun.serve({
	port: PORT,
	async fetch(req) {
		const url = new URL(req.url);
		const path = url.pathname;

		// Serve CSS
		if (path === "/styles.css") {
			const cssPath = join(PUBLIC_DIR, "styles.css");
			if (existsSync(cssPath)) {
				return new Response(readFileSync(cssPath), {
					headers: { "Content-Type": "text/css" },
				});
			}
		}

		// Landing Page
		if (path === "/" || path === "/index.html") {
			const html = "<!DOCTYPE html>\n" + renderToString(LandingPage());
			return new Response(html, {
				headers: { "Content-Type": "text/html; charset=utf-8" },
			});
		}

		// Documentation Pages
		if (path.startsWith("/docs/")) {
			const cleanSlug = path.replace(/^\/docs\//, "").replace(/\.html$/, "");
			const allDocs = getAllDocs();
			const allFrontmatters: DocFrontmatter[] = allDocs.map(
				(d) => d.frontmatter,
			);
			const matchedDoc = allDocs.find((d) => d.frontmatter.slug === cleanSlug);

			if (matchedDoc) {
				const html =
					"<!DOCTYPE html>\n" +
					renderToString(
						DocPage({ doc: matchedDoc, allDocs: allFrontmatters }),
					);
				return new Response(html, {
					headers: { "Content-Type": "text/html; charset=utf-8" },
				});
			}
		}

		return new Response("404 Not Found", { status: 404 });
	},
});

console.log(
	`🚀 Kontest Docs & Marketing live dev server running at http://localhost:${PORT}`,
);
