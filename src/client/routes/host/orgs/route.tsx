import { createFileRoute, Outlet } from "@tanstack/solid-router";

export const Route = createFileRoute("/host/orgs")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
