import { createFileRoute } from "@tanstack/solid-router";
import { useContext } from "solid-js";
import CallContext from "~/context/call";

export const Route = createFileRoute(
	"/host/orgs/$orgSlug/calls/$callSlug/dashboard",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const call = useContext(CallContext);
	return <div>Hello {call?.name}!</div>;
}
