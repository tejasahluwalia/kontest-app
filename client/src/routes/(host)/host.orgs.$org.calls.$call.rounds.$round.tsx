import RoundContext from "@client/context/round";
import server from "@client/lib/server-api";
import { notFound, Outlet } from "@tanstack/solid-router";

export const Route = createFileRoute({
	component: RouteComponent,
	beforeLoad: async ({ params, context: { org, call } }) => {
		// First fetch all rounds for this call
		const {
			data: rounds,
			error: roundsError,
			status: roundsStatus,
		} = await server.api.host
			.orgs({ orgId: org.id })
			.calls({ callId: call.id })
			.rounds.get();
		if (roundsError) {
			throw roundsError.value;
		}
		if (roundsStatus !== 200) {
			throw new Error(`Failed to fetch rounds: ${roundsStatus}`);
		}

		const roundId = rounds.find((round) => round.slug === params.round)?.id;
		if (!roundId) throw notFound({ data: { message: "Round not found" } });

		const { data, error, status } = await server.api.host
			.orgs({ orgId: org.id })
			.calls({ callId: call.id })
			.rounds({ roundId: roundId })
			.get();
		if (error) {
			throw error.value;
		}
		if (status !== 200) {
			throw new Error(`Failed to fetch round: ${status}`);
		}
		return { round: data };
	},
	loader(ctx) {
		return { round: ctx.context.round };
	},
});

function RouteComponent() {
	const { round } = Route.useLoaderData()();
	const routeContext = Route.useRouteContext();
	const org = () => routeContext().org;
	const call = () => routeContext().call;

	return (
		<RoundContext.Provider value={round}>
			<div class="space-y-6">
				<div class="bg-white p-6 rounded-lg border">
					<div class="flex items-center justify-between mb-4">
						<div>
							<h1 class="text-2xl font-bold">{round.name}</h1>
							<p class="text-gray-600">Slug: {round.slug}</p>
						</div>
						<a
							href={`/host/orgs/${org().slug}/calls/${call().slug}/rounds/${round.slug}/configure`}
							class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
						>
							Configure Round
						</a>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
						<div>
							<h3 class="font-semibold text-gray-900 mb-2">
								Round Information
							</h3>
							<div class="space-y-2">
								{round.startDate && (
									<p class="text-sm text-gray-600">
										<span class="font-medium">Start Date:</span>{" "}
										{new Date(round.startDate).toLocaleString()}
									</p>
								)}
								{round.endDate && (
									<p class="text-sm text-gray-600">
										<span class="font-medium">End Date:</span>{" "}
										{new Date(round.endDate).toLocaleString()}
									</p>
								)}
								<p class="text-sm text-gray-600">
									<span class="font-medium">Created:</span>{" "}
									{new Date(round.createdAt).toLocaleString()}
								</p>
							</div>
						</div>

						<div>
							<h3 class="font-semibold text-gray-900 mb-2">
								Form Configuration
							</h3>
							<div class="space-y-2">
								<p class="text-sm text-gray-600">
									<span class="font-medium">Form Schema:</span>{" "}
									{round.formSchema ? "Configured" : "Not configured"}
								</p>
								<p class="text-sm text-gray-600">
									<span class="font-medium">Judging Schema:</span>{" "}
									{round.judgingSchema ? "Configured" : "Not configured"}
								</p>
							</div>
						</div>
					</div>
				</div>

				<Outlet />
			</div>
		</RoundContext.Provider>
	);
}
