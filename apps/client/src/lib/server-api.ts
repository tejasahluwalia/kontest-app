import { treaty } from "@elysia/eden";
import type { App } from "@server/index";
import { env } from "~/env";

const treatyClient = treaty<App>(env.VITE_SERVER_URL);

const server = {
	get api() {
		return treatyClient.api;
	},
};

export default server;
