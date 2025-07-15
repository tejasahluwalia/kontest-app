import { notFound, Outlet } from "@tanstack/solid-router";
import CallContext from "~/context/call";
import server from "~/lib/server-api";

export const Route = createFileRoute({
	component: RouteComponent,
	beforeLoad: async ({
		params,
		context: {
			member: { org },
		},
	}) => {
		const { calls } = org;
		const callId = calls.find((call) => call.slug === params.callSlug)?.id;
		if (!callId) throw notFound({ data: { message: "Call not found" } });
		const { data, error, status } = await server.api.host
			.orgs({ orgId: org.id })
			.calls({ callId: callId })
			.get();
		if (error) {
			throw error.value;
		}
		if (status !== 200) {
			throw new Error(`Failed to fetch call: ${status}`);
		}
		return { call: data };
	},
	loader(ctx) {
		return { call: ctx.context.call };
	},
});

function RouteComponent() {
	const { call } = Route.useLoaderData()();
	return (
		<CallContext.Provider value={call}>
			<Outlet />
		</CallContext.Provider>
	);
}
