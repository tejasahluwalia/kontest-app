import { createFileRoute, Outlet } from "@tanstack/solid-router";

export const Route = createFileRoute("/host/orgs/$orgSlug/calls")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
