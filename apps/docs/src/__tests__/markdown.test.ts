import { describe, expect, it } from "bun:test";
import { parseFrontmatter, parseMarkdown } from "../lib/markdown";

describe("Markdown & Frontmatter Parser", () => {
	it("parses YAML frontmatter and body", () => {
		const md = `---
title: "Getting Started"
section: "Guides"
order: 2
badge: "Core"
---
# Welcome
This is the getting started guide.`;

		const { frontmatter, body } = parseFrontmatter(md);
		expect(frontmatter.title).toBe("Getting Started");
		expect(frontmatter.section).toBe("Guides");
		expect(frontmatter.order).toBe(2);
		expect(frontmatter.badge).toBe("Core");
		expect(body.trim()).toContain("# Welcome");
	});

	it("parses headings and builds table of contents", () => {
		const md = `---
title: "TOC Test"
---
# Main Title
## Section One
### Subsection Alpha
#### Deep Header
## Section Two`;

		const result = parseMarkdown(md, "toc-test");
		expect(result.toc.length).toBe(4); // h1, h2, h3, h2
		expect(result.toc[0].text).toBe("Main Title");
		expect(result.toc[1].text).toBe("Section One");
		expect(result.toc[2].text).toBe("Subsection Alpha");
		expect(result.toc[3].text).toBe("Section Two");
		expect(result.html).toContain('id="section-one"');
	});

	it("parses fenced code blocks with language tags", () => {
		const md = `---
title: "Code Test"
---
\`\`\`typescript
const greeting: string = "hello world";
console.log(greeting);
\`\`\``;

		const result = parseMarkdown(md);
		expect(result.html).toContain("code-block-wrapper");
		expect(result.html).toContain('class="language-typescript"');
		expect(result.html).toContain("tok-keyword");
	});

	it("parses callout boxes (> [!NOTE], > [!TIP])", () => {
		const md = `---
title: "Callout Test"
---
> [!NOTE]
> This is a helpful note for developers.

> [!WARNING]
> Be careful with production environments.`;

		const result = parseMarkdown(md);
		expect(result.html).toContain("callout callout-note");
		expect(result.html).toContain("callout callout-warning");
		expect(result.html).toContain("This is a helpful note");
	});

	it("parses markdown tables properly", () => {
		const md = `---
title: "Table Test"
---
| Feature | Status | Priority |
| :--- | :--- | :--- |
| Auth | Complete | High |
| SSR | Ready | Medium |`;

		const result = parseMarkdown(md);
		expect(result.html).toContain("<table");
		expect(result.html).toContain("Auth");
		expect(result.html).toContain("Complete");
	});
});
