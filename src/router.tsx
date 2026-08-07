import { QueryClient } from "@tanstack/solid-query";
import { createRouter, ErrorComponent } from "@tanstack/solid-router";
import { Spinner } from "./client/components/spinner";
import { authClient } from "./client/lib/auth-client";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const queryClient = new QueryClient();

	const router = createRouter({
		routeTree,
		context: {
			auth: authClient.getSession,
			queryClient,
		},
		defaultPendingComponent: () => (
			<div class={`p-2 text-2xl`}>
				<Spinner />
			</div>
		),
		defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		scrollRestoration: true,
		trailingSlash: "never",
	});

	return router;
}
