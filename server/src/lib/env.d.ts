declare module "bun" {
	interface Env {
		DATABASE_URL: string;
		AUTH_SECRET: string;
		PUBLIC_AUTH_URL: string;
	}
}
