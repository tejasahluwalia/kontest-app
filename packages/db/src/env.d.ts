declare module "bun" {
	interface Env {
		DATABASE_URL?: string;
		NODE_ENV?: string;
	}
}
