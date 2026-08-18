import { Fragment, h } from "../lib/jsx";

interface NavbarProps {
	activePage?: string;
}

export function Navbar({ activePage }: NavbarProps) {
	return (
		<header class="header">
			<div class="container nav-container">
				<a href="/index.html" class="logo-link">
					<span class="logo-badge">K</span>
					<span>Kontest</span>
				</a>

				<nav class="nav-links">
					<a
						href="/docs/introduction.html"
						class={`nav-link ${activePage?.startsWith("/docs") ? "active" : ""}`}
					>
						Documentation
					</a>
					<a href="/docs/architecture.html" class="nav-link">
						Architecture
					</a>
					<a href="/docs/routing-migration.html" class="nav-link">
						Solid 2 Router
					</a>
					<a href="/docs/server-api.html" class="nav-link">
						API Reference
					</a>
				</nav>

				<div class="nav-actions">
					<button
						id="theme-toggle"
						class="theme-toggle"
						aria-label="Toggle color theme"
						onclick="const current = document.documentElement.getAttribute('data-theme'); const next = current === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', next); localStorage.setItem('theme', next);"
					>
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<circle cx="12" cy="12" r="4"></circle>
							<path d="M12 2v2"></path>
							<path d="M12 20v2"></path>
							<path d="m4.93 4.93 1.41 1.41"></path>
							<path d="m17.66 17.66 1.41 1.41"></path>
							<path d="M2 12h2"></path>
							<path d="M20 12h2"></path>
							<path d="m6.34 17.66-1.41 1.41"></path>
							<path d="m19.07 4.93-1.41 1.41"></path>
						</svg>
					</button>

					<a
						href="http://localhost:5173"
						class="btn btn-secondary btn-sm"
						target="_blank"
						rel="noopener"
					>
						Launch App
					</a>

					<a href="/docs/getting-started.html" class="btn btn-primary btn-sm">
						Get Started
					</a>
				</div>
			</div>
		</header>
	);
}
