import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

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
	envPrefix: "PUBLIC_",
});
