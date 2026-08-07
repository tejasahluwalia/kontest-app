import { createFileRoute, notFound, Outlet } from "@tanstack/solid-router";
import RoundContext from "~/context/round";
import server from "~/lib/server-api";

export const Route = createFileRoute(
	"/host/orgs/$orgSlug/calls/$callSlug/rounds/$roundSlug",
)({
	component: RouteComponent,
	beforeLoad: async ({ params, context }) => {
		const call = (context as any).call;
		const round = call?.rounds?.find(
			(round: any) => round.slug === params.roundSlug,
		);
		if (!round) {
			throw notFound();
		}
		const { data, error } = await server.api.host
			.orgs({ orgSlug: params.orgSlug })
			.calls({ callId: call.id })
			.rounds({ roundId: round.id })
			.get();
		if (error) {
			throw error.value;
		}
		return {
			round: data,
		} as any;
	},
	loader(ctx) {
		return { round: ctx.context.round };
	},
});

function RouteComponent() {
	const { round } = Route.useLoaderData()();
	return (
		<RoundContext value={round}>
			<Outlet />
		</RoundContext>
	);
}
