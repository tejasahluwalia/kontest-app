declare module "bun" {
	interface Env {
		PORT?: string;
		DOCS_PORT?: string;
		NODE_ENV?: string;
	}
}
