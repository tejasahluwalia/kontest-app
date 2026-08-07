import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import { defineConfig } from "vite";
import viteSolid from "vite-plugin-solid";

export default defineConfig({
	plugins: [tanstackStart(), viteSolid({ ssr: false }), tailwindcss()],
	resolve: {
		alias: [
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
