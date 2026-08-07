import { createFileRoute, notFound, Outlet } from "@tanstack/solid-router";
import CallContext from "~/context/call";
import server from "~/lib/server-api";

export const Route = createFileRoute("/host/orgs/$orgSlug/calls/$callSlug")({
	component: RouteComponent,
	beforeLoad: async ({ params }) => {
		const { data: orgData } = await server.api.host
			.orgs({ orgSlug: params.orgSlug })
			.get();
		const org = Array.isArray(orgData) ? orgData[0] : orgData;
		const callItem = org?.calls?.find((c: any) => c.slug === params.callSlug);
		if (!callItem) throw notFound({ data: { message: "Call not found" } });
		const { data, error, status } = await server.api.host
			.orgs({ orgSlug: params.orgSlug })
			.calls({ callId: callItem.id })
			.get();
		if (error) {
			throw error.value;
		}
		if (status !== 200) {
			throw new Error(`Failed to fetch call: ${status}`);
		}
		return { call: data } as any;
	},
	loader(ctx) {
		return { call: ctx.context.call };
	},
});

function RouteComponent() {
	const { call } = Route.useLoaderData()();
	return (
		<CallContext value={call}>
			<Outlet />
		</CallContext>
	);
}
