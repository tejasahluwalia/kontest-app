import { describe, expect, it } from "bun:test";
import { checkAllEnv } from "../check";
import { createClientEnv } from "../client";
import { createDbEnv } from "../db";
import { createDocsEnv } from "../docs";
import { createServerEnv } from "../server";

describe("@kontest/env Configuration Suite (Bun Native, Constructed DATABASE_URL)", () => {
	it("validates database environment and constructs DATABASE_URL", () => {
		const env = createDbEnv({
			POSTGRES_HOST: "localhost",
			POSTGRES_PORT: "5432",
			POSTGRES_USER: "user",
			POSTGRES_PASSWORD: "password",
			POSTGRES_DB: "testdb",
			NODE_ENV: "test",
		});

		expect(env.POSTGRES_HOST).toBe("localhost");
		expect(env.POSTGRES_PORT).toBe(5432);
		expect(env.DATABASE_URL).toBe(
			"postgres://user:password@localhost:5432/testdb",
		);
		expect(env.NODE_ENV).toBe("test");
	});

	it("throws on missing POSTGRES_* or NODE_ENV in db schema", () => {
		expect(() =>
			createDbEnv({
				POSTGRES_HOST: "localhost",
				POSTGRES_PORT: "5432",
				POSTGRES_USER: "user",
				POSTGRES_PASSWORD: "password",
				NODE_ENV: "development",
			}),
		).toThrow("POSTGRES_DB");

		expect(() =>
			createDbEnv({
				POSTGRES_HOST: "localhost",
				POSTGRES_PORT: "5432",
				POSTGRES_USER: "user",
				POSTGRES_PASSWORD: "password",
				POSTGRES_DB: "testdb",
			}),
		).toThrow("NODE_ENV");
	});

	it("validates server environment and constructs DATABASE_URL", () => {
		const env = createServerEnv({
			PORT: "3000",
			AUTH_SECRET: "1234567890123456",
			SERVER_URL: "http://localhost:3000",
			AUTH_URL: "http://localhost:3000",
			POSTGRES_HOST: "localhost",
			POSTGRES_PORT: "5432",
			POSTGRES_USER: "user",
			POSTGRES_PASSWORD: "password",
			POSTGRES_DB: "testdb",
			NODE_ENV: "development",
		});

		expect(env.PORT).toBe(3000);
		expect(env.AUTH_SECRET).toBe("1234567890123456");
		expect(env.SERVER_URL).toBe("http://localhost:3000");
		expect(env.AUTH_URL).toBe("http://localhost:3000");
		expect(env.DATABASE_URL).toBe(
			"postgres://user:password@localhost:5432/testdb",
		);
	});

	it("throws if server environment is missing keys", () => {
		expect(() =>
			createServerEnv({
				PORT: 3000,
				POSTGRES_HOST: "localhost",
				POSTGRES_PORT: "5432",
				POSTGRES_USER: "user",
				POSTGRES_PASSWORD: "password",
				POSTGRES_DB: "testdb",
				NODE_ENV: "development",
			}),
		).toThrow("AUTH_SECRET");

		expect(() =>
			createServerEnv({
				AUTH_SECRET: "1234567890123456",
				SERVER_URL: "http://localhost:3000",
				AUTH_URL: "http://localhost:3000",
				POSTGRES_HOST: "localhost",
				POSTGRES_PORT: "5432",
				POSTGRES_USER: "user",
				POSTGRES_PASSWORD: "password",
				POSTGRES_DB: "testdb",
				NODE_ENV: "development",
			}),
		).toThrow("PORT");
	});

	it("throws if AUTH_SECRET is shorter than 16 characters", () => {
		expect(() =>
			createServerEnv({
				PORT: 3000,
				SERVER_URL: "http://localhost:3000",
				AUTH_URL: "http://localhost:3000",
				POSTGRES_HOST: "localhost",
				POSTGRES_PORT: "5432",
				POSTGRES_USER: "user",
				POSTGRES_PASSWORD: "password",
				POSTGRES_DB: "testdb",
				NODE_ENV: "development",
				AUTH_SECRET: "too_short",
			}),
		).toThrow("AUTH_SECRET must be at least 16 characters long");
	});

	it("validates client environment with explicit keys", () => {
		const env = createClientEnv({
			VITE_SERVER_URL: "http://localhost:3000",
			VITE_AUTH_URL: "http://localhost:3000",
		});

		expect(env.VITE_SERVER_URL).toBe("http://localhost:3000");
		expect(env.VITE_AUTH_URL).toBe("http://localhost:3000");
	});

	it("throws on missing client keys", () => {
		expect(() =>
			createClientEnv({
				VITE_SERVER_URL: "http://localhost:3000",
			}),
		).toThrow("VITE_AUTH_URL");
	});

	it("validates docs environment with explicit keys", () => {
		const env = createDocsEnv({
			DOCS_PORT: "4000",
			NODE_ENV: "development",
		});

		expect(env.DOCS_PORT).toBe(4000);
		expect(env.NODE_ENV).toBe("development");
	});

	it("throws on missing docs keys", () => {
		expect(() =>
			createDocsEnv({
				NODE_ENV: "development",
			}),
		).toThrow("DOCS_PORT");
	});

	it("checkAllEnv passes when complete .env is provided", () => {
		const results = checkAllEnv({
			NODE_ENV: "development",
			POSTGRES_HOST: "localhost",
			POSTGRES_PORT: "5432",
			POSTGRES_USER: "user",
			POSTGRES_PASSWORD: "password",
			POSTGRES_DB: "postgres",
			PORT: "3000",
			SERVER_URL: "http://localhost:3000",
			AUTH_URL: "http://localhost:3000",
			AUTH_SECRET: "kontest_dev_super_secret_key_1234567890",
			VITE_SERVER_URL: "http://localhost:3000",
			VITE_AUTH_URL: "http://localhost:3000",
			DOCS_PORT: "4000",
		});

		for (const res of results) {
			expect(res.success).toBe(true);
		}
	});
});
