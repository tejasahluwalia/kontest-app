import { resolve } from "node:path";
import viteSolid from "@solidjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig, type Plugin } from "vite";

function solid2Compat(): Plugin {
	return {
		name: "solid2-compat",
		enforce: "pre",
		transform(code, id) {
			if (id.includes("@formisch/solid")) {
				let modified = code;
				if (modified.includes("splitProps")) {
					modified = modified
						.replace(
							/import\s*\{[^}]*\bsplitProps\b[^}]*\}\s*from\s*["']solid-js["'];?/g,
							`function __splitProps(props, keys) {
	const allKeys = new Set(keys);
	const picked = {};
	const rest = {};
	for (const k of keys) {
		Object.defineProperty(picked, k, { get: () => props[k], enumerable: true, configurable: true });
	}
	for (const k in props) {
		if (!allKeys.has(k)) {
			Object.defineProperty(rest, k, { get: () => props[k], enumerable: true, configurable: true });
		}
	}
	return [picked, rest];
}`,
						)
						.replace(/\bsplitProps\b/g, "__splitProps");
				}
				if (modified.includes("batch")) {
					modified = modified
						.replace(
							/import\s*\{([^}]*)\bbatch\b,?([^}]*)\}\s*from\s*["']solid-js["'];?/g,
							'import { $1 $2 } from "solid-js";\nconst __batch = (fn) => fn();',
						)
						.replace(/\bbatch\(/g, "__batch(");
				}
				return {
					code: modified,
					map: null,
				};
			}
			if (id.includes("@kobalte/core") && id.includes("color-mode")) {
				let modified = code;
				if (modified.includes("createEffect")) {
					modified = modified.replace(
						/createEffect\s*\(\s*\(\s*\)\s*=>\s*\{\s*setColorMode\s*\(\s*colorModeManager\s*\(\s*\)\.get\s*\(\s*\)\s*\?\?\s*fallbackColorMode\s*\(\s*\)\s*\)\s*;\s*\}\s*\)/g,
						"createEffect(() => colorModeManager().get() ?? fallbackColorMode(), (mode) => { setColorMode(mode); })",
					);
				}
				return {
					code: modified,
					map: null,
				};
			}
		},
	};
}

export default defineConfig({
	plugins: [
		tanstackRouter({ target: "solid", autoCodeSplitting: true }),
		solid2Compat(),
		viteSolid({ start: true }),
		tailwindcss(),
	],
	resolve: {
		alias: [
			{ find: "solid-js/web", replacement: "@solidjs/web" },
			{ find: "solid-js/store", replacement: "solid-js" },
			{ find: "~", replacement: resolve(import.meta.dirname, "./src") },
			{ find: "@client", replacement: resolve(import.meta.dirname, "./src") },
			{
				find: "@kontest/db",
				replacement: resolve(
					import.meta.dirname,
					"../../packages/db/src/index.ts",
				),
			},
			{
				find: "@kontest/db/*",
				replacement: resolve(import.meta.dirname, "../../packages/db/src/*"),
			},
			{
				find: "@db",
				replacement: resolve(import.meta.dirname, "../../packages/db/src"),
			},
			{
				find: "@server",
				replacement: resolve(import.meta.dirname, "../server/src"),
			},
		],
	},
	optimizeDeps: {
		exclude: ["@formisch/solid", "@kobalte/core"],
	},
	build: {
		target: "esnext",
		assetsInlineLimit: 0,
	},
	envDir: resolve(import.meta.dirname, "../../"),
	envPrefix: "VITE_",
	server: {
		port: 5173,
	},
});
