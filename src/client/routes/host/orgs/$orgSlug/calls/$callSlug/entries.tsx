import { createFileRoute } from "@tanstack/solid-router";
export const Route = createFileRoute(
	"/host/orgs/$orgSlug/calls/$callSlug/entries",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/host/calls/$callSlug/entries"!</div>;
}
