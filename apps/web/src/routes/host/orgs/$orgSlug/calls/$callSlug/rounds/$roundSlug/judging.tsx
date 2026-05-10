export const Route = createFileRoute({
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
