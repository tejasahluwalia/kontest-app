import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { Fragment, h, renderToString } from "./lib/jsx";
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
const DIST_DIR = join(ROOT_DIR, "dist");
const DIST_DOCS_DIR = join(DIST_DIR, "docs");

console.log("⚡ Building Kontest Marketing & Docs site with Bun SSG...");

// 1. Prepare directories
if (!existsSync(DIST_DIR)) mkdirSync(DIST_DIR, { recursive: true });
if (!existsSync(DIST_DOCS_DIR)) mkdirSync(DIST_DOCS_DIR, { recursive: true });

// 2. Copy static public assets (CSS, etc.)
if (existsSync(join(PUBLIC_DIR, "styles.css"))) {
	copyFileSync(join(PUBLIC_DIR, "styles.css"), join(DIST_DIR, "styles.css"));
	console.log("✓ Copied styles.css to dist/styles.css");
}

// 3. Read and parse all Markdown documentation
const mdFiles = readdirSync(CONTENT_DIR).filter((file) => file.endsWith(".md"));
const parsedDocs: ParsedMarkdown[] = [];

for (const file of mdFiles) {
	const filePath = join(CONTENT_DIR, file);
	const rawContent = readFileSync(filePath, "utf-8");
	const slug = file.replace(/\.md$/, "");
	const parsed = parseMarkdown(rawContent, slug);
	parsedDocs.push(parsed);
}

const allFrontmatters: DocFrontmatter[] = parsedDocs.map((d) => d.frontmatter);

// 4. Render Marketing Landing Page (index.html)
const landingHtml = "<!DOCTYPE html>\n" + renderToString(<LandingPage />);
writeFileSync(join(DIST_DIR, "index.html"), landingHtml, "utf-8");
console.log("✓ Rendered dist/index.html");

// 5. Render Documentation Pages (docs/*.html)
for (const doc of parsedDocs) {
	const docHtml =
		"<!DOCTYPE html>\n" +
		renderToString(<DocPage doc={doc} allDocs={allFrontmatters} />);
	const outPath = join(DIST_DOCS_DIR, `${doc.frontmatter.slug}.html`);
	writeFileSync(outPath, docHtml, "utf-8");
	console.log(
		`✓ Rendered dist/docs/${doc.frontmatter.slug}.html (${doc.readingTime})`,
	);
}

console.log(
	`\n🎉 SSG Build complete! Generated 1 landing page + ${parsedDocs.length} documentation pages in dist/\n`,
);
