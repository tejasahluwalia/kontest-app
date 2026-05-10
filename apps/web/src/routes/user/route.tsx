import { Outlet } from "@tanstack/solid-router";
import Header from "~/components/layouts/header";

export const Route = createFileRoute({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<Header>Profile</Header>
			<div class="container py-6">
				<Outlet />
			</div>
		</>
	);
}
