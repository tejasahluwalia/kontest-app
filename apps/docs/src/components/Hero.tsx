import { Fragment, h } from "../lib/jsx";

export function Hero() {
	return (
		<section class="hero-section container">
			<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 3rem; align-items: center;">
				<div>
					<div class="hero-badge-pill">
						<span style="color: var(--brand-primary); font-weight: 700;">
							NEW
						</span>
						<span>Modular Monorepo Powered by pnpm &amp; Bun</span>
					</div>

					<h1 class="hero-title">
						The modern submission &amp; judging platform.
					</h1>

					<p class="hero-subtitle">
						Kontest gives organizations everything needed to run hackathons,
						grant allocations, awards, and multi-stage evaluation programs with
						end-to-end type safety.
					</p>

					<div class="hero-actions">
						<a href="/docs/getting-started.html" class="btn btn-primary btn-lg">
							Explore Documentation
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M5 12h14"></path>
								<path d="m12 5 7 7-7 7"></path>
							</svg>
						</a>
						<a href="/docs/architecture.html" class="btn btn-secondary btn-lg">
							View Architecture
						</a>
					</div>
				</div>

				<div>
					<div class="terminal-card">
						<div class="terminal-header">
							<div class="terminal-dots">
								<div class="terminal-dot terminal-dot-red"></div>
								<div class="terminal-dot terminal-dot-yellow"></div>
								<div class="terminal-dot terminal-dot-green"></div>
							</div>
							<span style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted);">
								quickstart.sh
							</span>
						</div>
						<div class="terminal-body">
							<div style="color: var(--text-muted); margin-bottom: 0.5rem;">
								# 1. Clone &amp; install monorepo
							</div>
							<div>
								<span style="color: var(--brand-primary);">$</span> pnpm install
							</div>
							<div style="color: var(--text-muted); margin-top: 0.75rem; margin-bottom: 0.5rem;">
								# 2. Boot PostgreSQL &amp; push schema
							</div>
							<div>
								<span style="color: var(--brand-primary);">$</span> pnpm db:up
								&amp;&amp; pnpm db:push
							</div>
							<div style="color: var(--text-muted); margin-top: 0.75rem; margin-bottom: 0.5rem;">
								# 3. Start development servers
							</div>
							<div>
								<span style="color: var(--brand-primary);">$</span> pnpm dev
							</div>
							<div style="margin-top: 1rem; color: #10b981; font-weight: 600;">
								✓ Client ready on http://localhost:5173
								<br />✓ Server running on http://localhost:3000
								<br />✓ Docs &amp; Marketing on http://localhost:4000
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
