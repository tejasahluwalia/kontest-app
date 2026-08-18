import { createFileRoute } from "@tanstack/solid-router";
export const Route = createFileRoute(
	"/host/orgs/$orgSlug/calls/$callSlug/rounds/$roundSlug/judging",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			Hello
			"/(host)/host/orgs/$orgSlug/calls/$callSlug/rounds/$roundSlug/judging"!
		</div>
	);
}
