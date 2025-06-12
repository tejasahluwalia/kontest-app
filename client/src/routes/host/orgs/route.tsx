import server from "@client/lib/server-api";
import { createFileRoute, Outlet } from "@tanstack/solid-router";

export const Route = createFileRoute("/host/orgs")({
	component: RouteComponent,
	beforeLoad: async () => {
		const { data, error, status } = await server.api.host.orgs.get();
		if (error) {
			throw error.value;
		}
		if (status !== 200) {
			throw new Error(`Failed to fetch orgs: ${status}`);
		}
		return { orgs: data };
	},
});

function RouteComponent() {
	return (
		<>
			<Outlet />
		</>
	);
}
