import { notFound, Outlet } from "@tanstack/solid-router";
import RoundContext from "~/context/round";
import server from "~/lib/server-api";

export const Route = createFileRoute({
	component: RouteComponent,
	beforeLoad: async ({ params, context: { org, call } }) => {
		const round = call.rounds.find((round) => round.slug === params.round);
		if (!round) {
			throw notFound();
		}
		const { data, error } = await server.api.host
			.orgs({ orgId: org.id })
			.calls({ callId: call.id })
			.rounds({ roundId: round.id })
			.get();
		if (error) {
			throw error.value;
		}
		return {
			round: data,
		};
	},
	loader(ctx) {
		return { round: ctx.context.round };
	},
});

function RouteComponent() {
	const { round } = Route.useLoaderData()();
	return (
		<RoundContext.Provider value={round}>
			<Outlet />
		</RoundContext.Provider>
	);
}
