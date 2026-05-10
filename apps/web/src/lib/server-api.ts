import type { App } from "@api/index";
import { treaty } from "@elysiajs/eden";

const PUBLIC_SERVER_URL = import.meta.env.PUBLIC_SERVER_URL;

if (!PUBLIC_SERVER_URL) throw Error("PUBLIC_SERVER_URL missing");

const server = treaty<App>(PUBLIC_SERVER_URL, {
	fetch: { credentials: "include" },
});

export default server;
