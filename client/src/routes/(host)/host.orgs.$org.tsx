import { getRouteApi, notFound } from "@tanstack/solid-router";
import { Outlet } from "@tanstack/solid-router";
import server from "@client/lib/server-api";
import { ErrorBoundary } from "solid-js";
import OrgContext from "@client/context/org";

export const Route = createFileRoute({
	component: RouteComponent,
	beforeLoad: async ({ params, context: { orgs } }) => {
		const orgId = orgs.find((org) => org.slug === params.org)?.id;
		if (!orgId) {
			throw notFound();
		}

		const { data, error } = await server.api.host.orgs({ orgId }).get();
		if (error) {
			throw error.value;
		}

		return {
			org: data,
		};
	},
	loader: async ({ context: { org } }) => {
		return { org };
	},
});

function RouteComponent() {
	const { org } = Route.useLoaderData()();

	return (
		<OrgContext.Provider value={org}>
			<Outlet />
		</OrgContext.Provider>
	);
}
