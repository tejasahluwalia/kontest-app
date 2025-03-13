import { treaty } from "@elysiajs/eden";
import type { App } from "@server/index";
const server = treaty<App>("http://localhost:3000", { fetch: { credentials: 'include' } });

export default server;