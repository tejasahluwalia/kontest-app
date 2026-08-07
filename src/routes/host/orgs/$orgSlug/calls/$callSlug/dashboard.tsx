import { createFileRoute } from "@tanstack/solid-router";
export const Route = createFileRoute(
	"/host/orgs/$orgSlug/calls/$callSlug/dashboard",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const routeContext = Route.useRouteContext();
	// Safely access the call property with type assertion
	const call = () => routeContext().call;
	return <div>Hello {call().name}!</div>;
}
