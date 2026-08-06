import { treaty } from "@elysia/eden";
import type { App } from "@server/index";

const PUBLIC_SERVER_URL =
	import.meta.env.PUBLIC_SERVER_URL ?? window.location.origin;

const server = treaty<App>(PUBLIC_SERVER_URL, {
	fetch: { credentials: "include" },
});

export default server;
