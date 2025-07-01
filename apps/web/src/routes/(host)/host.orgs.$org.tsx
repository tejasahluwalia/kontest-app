import OrgContext from "~/context/org";
import server from "~/lib/server-api";
import { notFound, Outlet } from "@tanstack/solid-router";

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
