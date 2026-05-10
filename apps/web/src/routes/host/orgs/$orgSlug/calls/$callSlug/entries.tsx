export const Route = createFileRoute({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/host/calls/$callSlug/entries"!</div>;
}
