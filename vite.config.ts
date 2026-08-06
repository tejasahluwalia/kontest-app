import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
	plugins: [solid(), tailwindcss()],
	resolve: {
		alias: [
			{
				find: "@solidjs-core-v2",
				replacement: resolve(
					__dirname,
					"./node_modules/solid-js/dist/solid.js",
				),
			},
			{
				find: /^solid-js$/,
				replacement: resolve(__dirname, "./src/client/compat/solid-core.ts"),
			},
			{
				find: "solid-js/store",
				replacement: resolve(__dirname, "./src/client/compat/solid-store.ts"),
			},
			{ find: "solid-js/web", replacement: "@solidjs/web" },
			{ find: "~", replacement: resolve(__dirname, "./src/client") },
			{ find: "@client", replacement: resolve(__dirname, "./src/client") },
			{ find: "@server", replacement: resolve(__dirname, "./src/server") },
			{ find: "@db", replacement: resolve(__dirname, "./src/db") },
		],
	},
	build: {
		target: "esnext",
	},
	envPrefix: "PUBLIC_",
});
