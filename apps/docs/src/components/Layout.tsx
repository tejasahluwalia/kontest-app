import { Fragment, h, raw, type VNode } from "../lib/jsx";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

interface LayoutProps {
	title?: string;
	description?: string;
	activePage?: string;
	children?: VNode;
}

export function Layout({
	title = "Kontest — Modern Submission & Evaluation Platform",
	description = "Type-safe submission management and judging platform powered by SolidJS, Elysia, and Bun.",
	activePage,
	children,
}: LayoutProps) {
	const initThemeScript = `
(function() {
	try {
		const storedTheme = localStorage.getItem('theme');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const theme = storedTheme || (prefersDark ? 'dark' : 'light');
		document.documentElement.setAttribute('data-theme', theme);
	} catch(e) {}
})();
	`.trim();

	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>{title}</title>
				<meta name="description" content={description} />
				<meta property="og:title" content={title} />
				<meta property="og:description" content={description} />
				<meta property="og:type" content="website" />
				<link rel="stylesheet" href="/styles.css" />
				<script>{raw(initThemeScript)}</script>
			</head>
			<body>
				<Navbar activePage={activePage} />
				<main style="flex: 1;">{children}</main>
				<Footer />
			</body>
		</html>
	);
}
