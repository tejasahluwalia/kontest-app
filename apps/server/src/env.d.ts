declare module "bun" {
	interface Env {
		DATABASE_URL?: string;
		AUTH_SECRET?: string;
		PORT?: string;
		SERVER_PORT?: string;
		NODE_ENV?: string;
		VITE_SERVER_URL?: string;
		VITE_AUTH_URL?: string;
	}
}
