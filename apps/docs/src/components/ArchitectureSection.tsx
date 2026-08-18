import { Fragment, h } from "../lib/jsx";

export function ArchitectureSection() {
	const packages = [
		{
			name: "@kontest/client",
			path: "apps/client",
			tech: "SolidJS 2, Tailwind, Kobalte",
			desc: "Reactive frontend single-page application with customizable forms and judging views.",
		},
		{
			name: "@kontest/server",
			path: "apps/server",
			tech: "ElysiaJS, Bun, BetterAuth",
			desc: "High-throughput API backend with schema validation and end-to-end typed RPC.",
		},
		{
			name: "@kontest/docs",
			path: "apps/docs",
			tech: "Bun, JSX, Markdown SSG",
			desc: "Zero-hydration static documentation and marketing platform.",
		},
		{
			name: "@kontest/db",
			path: "packages/db",
			tech: "Drizzle ORM, PostgreSQL",
			desc: "Shared schema definitions, migrations, and TypeBox query models.",
		},
	];

	return (
		<section class="container" style="padding: 5rem 1.5rem;">
			<div class="section-header">
				<div class="section-tag">Workspace Packages</div>
				<h2 class="section-title">Clean Monorepo Boundaries</h2>
				<p class="section-desc">
					Each package has a single responsibility and shares types across the
					monorepo boundary.
				</p>
			</div>

			<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
				{packages.map((pkg) => (
					<div
						class="feature-card"
						style="display: flex; flex-direction: column; justify-content: space-between;"
					>
						<div>
							<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
								<span style="font-family: var(--font-mono); font-size: 0.8125rem; font-weight: 700; color: var(--brand-primary);">
									{pkg.path}
								</span>
								<span style="font-size: 0.75rem; background: var(--bg-muted); padding: 0.2rem 0.5rem; border-radius: 0.25rem; color: var(--text-muted);">
									{pkg.tech}
								</span>
							</div>
							<h3
								class="feature-title"
								style="font-size: 1.1rem; font-family: var(--font-mono);"
							>
								{pkg.name}
							</h3>
							<p class="feature-desc" style="font-size: 0.875rem;">
								{pkg.desc}
							</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
