import { Fragment, h } from "../lib/jsx";

export function Footer() {
	return (
		<footer class="footer">
			<div class="container footer-content">
				<div>
					<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
						<span
							class="logo-badge"
							style="width: 1.5rem; height: 1.5rem; font-size: 0.75rem;"
						>
							K
						</span>
						<span style="font-weight: 700; font-size: 1rem;">Kontest</span>
					</div>
					<p class="footer-text">
						Modern submission and judging platform built with SolidJS, Elysia,
						and Bun.
					</p>
				</div>

				<div class="footer-links">
					<a href="/docs/introduction.html">Docs</a>
					<a href="/docs/architecture.html">Architecture</a>
					<a href="/docs/routing-migration.html">Solid 2 Router</a>
					<a href="/docs/server-api.html">Server API</a>
					<a href="https://github.com" target="_blank" rel="noopener">
						GitHub
					</a>
				</div>
			</div>
		</footer>
	);
}
