import { createFileRoute } from "@tanstack/solid-router";
export const Route = createFileRoute("/user/profile")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/profile"!</div>;
}
