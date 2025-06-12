import { createRouter } from "@tanstack/solid-router";
import { routeTree } from "./routeTree.gen";
import { authClient } from "./lib/auth-client";

export const router = createRouter({
	routeTree,
	context: {
		auth: authClient.getSession,
	},
	defaultPreload: "intent",
	defaultStaleTime: 5000,
	scrollRestoration: true,
});
