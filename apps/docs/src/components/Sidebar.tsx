import { Fragment, h } from "../lib/jsx";
import type { DocFrontmatter } from "../lib/markdown";

interface SidebarProps {
	docs: DocFrontmatter[];
	currentSlug: string;
}

export function Sidebar({ docs, currentSlug }: SidebarProps) {
	const sections: Record<string, DocFrontmatter[]> = {
		Overview: [],
		Architecture: [],
		"Guides & Migration": [],
		"Backend & DB": [],
	};

	for (const doc of docs) {
		const sec = doc.section || "Overview";
		if (!sections[sec]) {
			sections[sec] = [];
		}
		sections[sec].push(doc);
	}

	for (const key of Object.keys(sections)) {
		sections[key].sort((a, b) => (a.order || 0) - (b.order || 0));
	}

	return (
		<aside class="docs-sidebar">
			{Object.entries(sections).map(([sectionTitle, items]) => {
				if (items.length === 0) return null;
				return (
					<div class="sidebar-group">
						<div class="sidebar-heading">{sectionTitle}</div>
						<ul class="sidebar-items">
							{items.map((item) => {
								const isActive = item.slug === currentSlug;
								return (
									<li>
										<a
											href={`/docs/${item.slug}.html`}
											class={`sidebar-link ${isActive ? "active" : ""}`}
										>
											<span>{item.title}</span>
											{item.badge ? (
												<span class="sidebar-badge">{item.badge}</span>
											) : null}
										</a>
									</li>
								);
							})}
						</ul>
					</div>
				);
			})}
		</aside>
	);
}
