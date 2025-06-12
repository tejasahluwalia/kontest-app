import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

export default defineConfig({
	plugins: [
		solid(),
		tailwindcss(),
		tanstackRouter({
			target: "solid",
			autoCodeSplitting: true,
			verboseFileRoutes: false,
		}),
	],
	envDir: "../",
	resolve: {
		alias: {
			"~": resolve(__dirname, "./src"),
			"@client": resolve(__dirname, "./src"),
			"@server": resolve(__dirname, "../server/src"),
		},
	},
	build: {
		target: "esnext",
	},
});
