import { treaty } from "@elysiajs/eden";
import type { App } from "@server/index";

const SERVER_URL = import.meta.env.PUBLIC_SERVER_URL;

if (!SERVER_URL) throw Error("Server URL missing");

const server = treaty<App>(SERVER_URL, {
	fetch: { credentials: "include" },
});

export default server;
