import { createFileRoute, notFound } from "@tanstack/solid-router";
import server from "@client/lib/server-api";

export const Route = createFileRoute("/host/orgs/$org/calls/$call/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const routeContext = Route.useRouteContext();
	// Safely access the call property with type assertion
	const call = () => routeContext().call;
	return <div>Hello {call().name}!</div>;
}
