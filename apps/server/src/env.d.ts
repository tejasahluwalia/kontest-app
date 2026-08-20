declare module "bun" {
	interface Env {
		POSTGRES_HOST?: string;
		POSTGRES_PORT?: string;
		POSTGRES_USER?: string;
		POSTGRES_PASSWORD?: string;
		POSTGRES_DB?: string;
		DATABASE_URL?: string;
		AUTH_SECRET?: string;
		PORT?: string;
		SERVER_PORT?: string;
		NODE_ENV?: string;
		SERVER_URL?: string;
		AUTH_URL?: string;
	}
}
