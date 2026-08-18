/**
 * Fast, self-contained Markdown and Frontmatter parser for Bun static documentation.
 */

export interface DocFrontmatter {
	title: string;
	description?: string;
	section?: string;
	order?: number;
	badge?: string;
	slug?: string;
	[key: string]: any;
}

export interface TocItem {
	id: string;
	text: string;
	level: number;
}

export interface ParsedMarkdown {
	frontmatter: DocFrontmatter;
	html: string;
	toc: TocItem[];
	readingTime: string;
	rawContent: string;
}

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/<[^>]*>/g, "")
		.replace(/[^\w\s-]/g, "")
		.trim()
		.replace(/[-\s]+/g, "-");
}

export function parseFrontmatter(rawContent: string): {
	frontmatter: DocFrontmatter;
	body: string;
} {
	const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;
	const match = rawContent.match(frontmatterRegex);

	if (!match) {
		return {
			frontmatter: { title: "Untitled" },
			body: rawContent,
		};
	}

	const yamlBlock = match[1];
	const body = rawContent.slice(match[0].length);
	const frontmatter: DocFrontmatter = { title: "Untitled" };

	for (const line of yamlBlock.split(/\r?\n/)) {
		const colonIndex = line.indexOf(":");
		if (colonIndex > 0) {
			const key = line.slice(0, colonIndex).trim();
			let val = line.slice(colonIndex + 1).trim();

			// Remove quotes if present
			if (
				(val.startsWith('"') && val.endsWith('"')) ||
				(val.startsWith("'") && val.endsWith("'"))
			) {
				val = val.slice(1, -1);
			}

			if (key === "order") {
				frontmatter.order = Number.parseInt(val, 10) || 0;
			} else {
				frontmatter[key] = val;
			}
		}
	}

	return { frontmatter, body };
}

function highlightCode(code: string, lang: string): string {
	const escaped = escapeHtml(code);
	// Basic syntax highlighting for keywords, strings, comments, numbers
	if (
		["ts", "tsx", "js", "jsx", "json", "yaml", "yml", "sh", "bash"].includes(
			lang.toLowerCase(),
		)
	) {
		return escaped
			.replace(
				/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g,
				'<span class="tok-comment">$1</span>',
			)
			.replace(/(["'`].*?["'`])/g, '<span class="tok-string">$1</span>')
			.replace(
				/\b(import|export|from|default|const|let|var|function|return|if|else|switch|case|break|for|while|async|await|try|catch|throw|class|extends|interface|type|new|typeof|instanceof|void|as)\b/g,
				'<span class="tok-keyword">$1</span>',
			)
			.replace(
				/\b(true|false|null|undefined|NaN|Infinity)\b/g,
				'<span class="tok-literal">$1</span>',
			)
			.replace(/\b([0-9]+)\b/g, '<span class="tok-number">$1</span>');
	}
	return escaped;
}

export function parseMarkdown(
	markdownString: string,
	defaultSlug?: string,
): ParsedMarkdown {
	const { frontmatter, body } = parseFrontmatter(markdownString);
	if (defaultSlug && !frontmatter.slug) {
		frontmatter.slug = defaultSlug;
	}

	const toc: TocItem[] = [];
	const words = body.split(/\s+/).length;
	const readingMinutes = Math.max(1, Math.ceil(words / 200));
	const readingTime = `${readingMinutes} min read`;

	const lines = body.split(/\r?\n/);
	const htmlParts: string[] = [];

	let i = 0;
	while (i < lines.length) {
		const line = lines[i];

		// Empty line
		if (line.trim() === "") {
			i++;
			continue;
		}

		// Horizontal rule
		if (/^(---|___|\*\*\*)$/.test(line.trim())) {
			htmlParts.push('<hr class="my-8 border-border" />');
			i++;
			continue;
		}

		// Fenced Code Block
		if (line.trim().startsWith("```")) {
			const lang = line.trim().slice(3).trim() || "text";
			const codeLines: string[] = [];
			i++;
			while (i < lines.length && !lines[i].trim().startsWith("```")) {
				codeLines.push(lines[i]);
				i++;
			}
			i++; // skip closing ```

			const rawCode = codeLines.join("\n");
			const highlighted = highlightCode(rawCode, lang);

			htmlParts.push(`
<div class="code-block-wrapper my-6 relative group">
	<div class="code-block-header flex items-center justify-between px-4 py-2 bg-muted/80 border border-b-0 border-border rounded-t-lg text-xs font-mono text-muted-foreground">
		<span class="font-semibold uppercase text-accent-foreground tracking-wider">${escapeHtml(lang)}</span>
		<button class="copy-btn px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs hover:bg-secondary/80 transition-colors" data-code="${escapeHtml(rawCode)}" onclick="navigator.clipboard.writeText(this.dataset.code); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy', 2000)">Copy</button>
	</div>
	<pre class="bg-card border border-border rounded-b-lg p-4 overflow-x-auto text-sm font-mono leading-relaxed"><code class="language-${escapeHtml(lang)}">${highlighted}</code></pre>
</div>`);
			continue;
		}

		// Callouts / Alerts (> [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING], > [!CAUTION])
		const calloutMatch = line.match(
			/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/i,
		);
		if (calloutMatch) {
			const type = calloutMatch[1].toUpperCase();
			const alertLines: string[] = [];
			if (calloutMatch[2].trim()) {
				alertLines.push(calloutMatch[2].trim());
			}
			i++;
			while (i < lines.length && lines[i].startsWith(">")) {
				alertLines.push(lines[i].replace(/^>\s?/, ""));
				i++;
			}

			const alertHtml = alertLines.map(parseInline).join("<br />");
			const badgeClass =
				{
					NOTE: "callout-note",
					TIP: "callout-tip",
					IMPORTANT: "callout-important",
					WARNING: "callout-warning",
					CAUTION: "callout-caution",
				}[type] || "callout-note";

			htmlParts.push(`
<div class="callout ${badgeClass} my-6 p-4 rounded-lg border">
	<div class="callout-title font-semibold mb-1 flex items-center gap-2 text-sm">
		<span class="callout-icon font-mono uppercase font-bold text-xs tracking-wider">${type}</span>
	</div>
	<div class="callout-content text-sm leading-relaxed">${alertHtml}</div>
</div>`);
			continue;
		}

		// Standard Blockquote
		if (line.startsWith(">")) {
			const quoteLines: string[] = [];
			while (i < lines.length && lines[i].startsWith(">")) {
				quoteLines.push(lines[i].replace(/^>\s?/, ""));
				i++;
			}
			const quoteContent = quoteLines.map(parseInline).join(" ");
			htmlParts.push(
				`<blockquote class="my-6 border-l-4 border-primary pl-4 italic text-muted-foreground">${quoteContent}</blockquote>`,
			);
			continue;
		}

		// Headings
		const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
		if (headingMatch) {
			const level = headingMatch[1].length;
			const text = headingMatch[2].trim();
			const id = slugify(text);
			const formattedText = parseInline(text);

			if (level <= 3) {
				toc.push({ id, text, level });
			}

			const headingClasses: Record<number, string> = {
				1: "text-3xl font-bold tracking-tight mt-10 mb-4 pb-2 border-b border-border",
				2: "text-2xl font-semibold tracking-tight mt-8 mb-3 scroll-mt-20 group flex items-center gap-2",
				3: "text-xl font-medium mt-6 mb-2 scroll-mt-20 group flex items-center gap-2",
				4: "text-lg font-medium mt-4 mb-2 scroll-mt-20",
				5: "text-base font-semibold mt-3 mb-1",
				6: "text-sm font-semibold uppercase tracking-wider text-muted-foreground mt-3 mb-1",
			};

			const cls = headingClasses[level] || "";
			const anchor =
				level <= 3
					? `<a href="#${id}" class="heading-anchor opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity" aria-label="Link to ${escapeHtml(text)}">#</a>`
					: "";

			htmlParts.push(
				`<h${level} id="${id}" class="${cls}">${formattedText} ${anchor}</h${level}>`,
			);
			i++;
			continue;
		}

		// Table
		if (
			line.includes("|") &&
			lines[i + 1] &&
			/^[|\s-:]+$/.test(lines[i + 1].trim())
		) {
			const tableLines: string[] = [];
			while (i < lines.length && lines[i].trim().startsWith("|")) {
				tableLines.push(lines[i].trim());
				i++;
			}

			if (tableLines.length >= 2) {
				const headerCells = tableLines[0]
					.split("|")
					.slice(1, -1)
					.map((c) => c.trim());
				const bodyRows = tableLines.slice(2);

				const thead = `<thead><tr class="border-b border-border bg-muted/40">${headerCells.map((h) => `<th class="p-3 text-left font-semibold text-xs tracking-wider uppercase text-muted-foreground">${parseInline(h)}</th>`).join("")}</tr></thead>`;

				const tbodyRows = bodyRows
					.map((row) => {
						const cells = row
							.split("|")
							.slice(1, -1)
							.map((c) => c.trim());
						return `<tr class="border-b border-border/50 hover:bg-muted/20 transition-colors">${cells.map((c) => `<td class="p-3 text-sm">${parseInline(c)}</td>`).join("")}</tr>`;
					})
					.join("");

				htmlParts.push(`
<div class="table-container my-6 overflow-x-auto border border-border rounded-lg shadow-sm">
	<table class="w-full text-left border-collapse">${thead}<tbody>${tbodyRows}</tbody></table>
</div>`);
				continue;
			}
		}

		// Lists (Unordered or Ordered)
		if (/^(\*|-|\+|\d+\.)\s+/.test(line.trim())) {
			const isOrdered = /^\d+\.\s+/.test(line.trim());
			const listTag = isOrdered ? "ol" : "ul";
			const listClass = isOrdered
				? "list-decimal list-inside space-y-2 my-4 pl-2"
				: "list-disc list-inside space-y-2 my-4 pl-2";
			const listItems: string[] = [];

			while (i < lines.length && /^(\*|-|\+|\d+\.)\s+/.test(lines[i].trim())) {
				const rawItem = lines[i].trim().replace(/^(\*|-|\+|\d+\.)\s+/, "");

				// Check for task list checkbox
				let itemHtml = "";
				if (rawItem.startsWith("[ ] ")) {
					itemHtml = `<input type="checkbox" disabled class="mr-2 rounded border-border" /> ${parseInline(rawItem.slice(4))}`;
				} else if (rawItem.startsWith("[x] ") || rawItem.startsWith("[X] ")) {
					itemHtml = `<input type="checkbox" checked disabled class="mr-2 rounded text-primary" /> <span class="line-through text-muted-foreground">${parseInline(rawItem.slice(4))}</span>`;
				} else {
					itemHtml = parseInline(rawItem);
				}

				listItems.push(
					`<li class="text-sm leading-relaxed text-foreground/90">${itemHtml}</li>`,
				);
				i++;
			}

			htmlParts.push(
				`<${listTag} class="${listClass}">${listItems.join("")}</${listTag}>`,
			);
			continue;
		}

		// Paragraph
		const paragraphLines: string[] = [];
		while (
			i < lines.length &&
			lines[i].trim() !== "" &&
			!lines[i].trim().startsWith("```") &&
			!lines[i].startsWith("#") &&
			!lines[i].startsWith(">") &&
			!/^(\*|-|\+|\d+\.)\s+/.test(lines[i].trim()) &&
			!lines[i].trim().startsWith("|")
		) {
			paragraphLines.push(lines[i]);
			i++;
		}

		if (paragraphLines.length > 0) {
			const content = paragraphLines.map(parseInline).join(" ");
			htmlParts.push(
				`<p class="my-4 text-base leading-relaxed text-foreground/90">${content}</p>`,
			);
		}
	}

	return {
		frontmatter,
		html: htmlParts.join("\n"),
		toc,
		readingTime,
		rawContent: markdownString,
	};
}

function parseInline(text: string): string {
	let res = escapeHtml(text);

	// Images: ![alt](url)
	res = res.replace(
		/!\[([^\]]*)\]\(([^)]+)\)/g,
		'<img src="$2" alt="$1" class="rounded-lg my-4 max-w-full border border-border" />',
	);

	// Links: [text](url)
	res = res.replace(
		/\[([^\]]+)\]\(([^)]+)\)/g,
		'<a href="$2" class="text-primary underline underline-offset-4 hover:text-primary/80 font-medium transition-colors">$1</a>',
	);

	// Bold: **text** or __text__
	res = res.replace(
		/\*\*(.*?)\*\*/g,
		'<strong class="font-semibold text-foreground">$1</strong>',
	);
	res = res.replace(
		/__(.*?)__/g,
		'<strong class="font-semibold text-foreground">$1</strong>',
	);

	// Italic: *text* or _text_
	res = res.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
	res = res.replace(/_([^_]+)_/g, '<em class="italic">$1</em>');

	// Strikethrough: ~~text~~
	res = res.replace(
		/~~(.*?)~~/g,
		'<del class="line-through text-muted-foreground">$1</del>',
	);

	// Inline code: `code`
	res = res.replace(
		/`([^`]+)`/g,
		'<code class="px-1.5 py-0.5 rounded bg-muted font-mono text-xs font-medium text-primary">$1</code>',
	);

	return res;
}
