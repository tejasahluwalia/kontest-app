import { Fragment, h } from "../lib/jsx";
import type { TocItem } from "../lib/markdown";

interface TocProps {
	items: TocItem[];
}

export function TableOfContents({ items }: TocProps) {
	if (!items || items.length === 0) return null;

	return (
		<aside class="docs-toc">
			<div class="toc-title">On this page</div>
			<ul class="toc-list">
				{items.map((item) => (
					<li>
						<a
							href={`#${item.id}`}
							class={`toc-link ${item.level === 3 ? "level-3" : ""}`}
						>
							{item.text}
						</a>
					</li>
				))}
			</ul>
		</aside>
	);
}
