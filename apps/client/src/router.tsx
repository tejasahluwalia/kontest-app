import { QueryClient } from "@tanstack/solid-query";
import { createRouter, ErrorComponent } from "@tanstack/solid-router";
import { Spinner } from "./components/spinner";
import { authClient } from "./lib/auth-client";
import { routeTree } from "./routeTree.gen";

export const queryClient = new QueryClient();

export const router = createRouter({
	routeTree,
	context: {
		auth: authClient.getSession,
		queryClient,
	},
	defaultPendingComponent: () => (
		<div class="p-2 text-2xl">
			<Spinner />
		</div>
	),
	defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
	defaultPreload: "intent",
	defaultPreloadStaleTime: 0,
	scrollRestoration: true,
	trailingSlash: "never",
});

declare module "@tanstack/solid-router" {
	interface Register {
		router: typeof router;
	}
}
