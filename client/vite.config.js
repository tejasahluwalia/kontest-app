import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    solid(),
    tailwindcss(),
    TanStackRouterVite({ target: "solid", autoCodeSplitting: true }),
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
