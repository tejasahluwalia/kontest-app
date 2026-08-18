import { Layout } from "../components/Layout";
import { Sidebar } from "../components/Sidebar";
import { TableOfContents } from "../components/TableOfContents";
import { Fragment, h, RawHtml } from "../lib/jsx";
import type { DocFrontmatter, ParsedMarkdown } from "../lib/markdown";

interface DocPageProps {
	doc: ParsedMarkdown;
	allDocs: DocFrontmatter[];
}

export function DocPage({ doc, allDocs }: DocPageProps) {
	const { frontmatter, html, toc, readingTime } = doc;

	return (
		<Layout
			title={`${frontmatter.title} — Kontest Docs`}
			description={frontmatter.description || "Documentation for Kontest."}
			activePage={`/docs/${frontmatter.slug}`}
		>
			<div class="docs-layout">
				<Sidebar docs={allDocs} currentSlug={frontmatter.slug || ""} />

				<div class="docs-main">
					<article class="docs-article">
						<header class="docs-header">
							{frontmatter.badge ? (
								<div class="docs-badge">{frontmatter.badge}</div>
							) : null}
							<h1 class="docs-title">{frontmatter.title}</h1>
							{frontmatter.description ? (
								<p class="docs-description">{frontmatter.description}</p>
							) : null}
							<div class="docs-meta">
								<span>📖 {readingTime}</span>
								<span>•</span>
								<span>Category: {frontmatter.section || "Overview"}</span>
							</div>
						</header>

						<div class="docs-body">
							<RawHtml html={html} />
						</div>
					</article>
				</div>

				<TableOfContents items={toc} />
			</div>
		</Layout>
	);
}
