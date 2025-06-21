import { Outlet } from "@tanstack/solid-router";

export const Route = createFileRoute({
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
