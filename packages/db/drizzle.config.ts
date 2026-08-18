import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url:
			process.env.DATABASE_URL ||
			(typeof Bun !== "undefined" ? Bun.env.DATABASE_URL : "") ||
			"",
	},
});
