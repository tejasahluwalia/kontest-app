import { Navigate } from "@tanstack/solid-router";

export const Route = createFileRoute({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Navigate
			from={Route.fullPath}
			to="/host/orgs/$org/calls"
			params={(prev) => ({ org: prev.org })}
		/>
	);
}
