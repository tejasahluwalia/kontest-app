import server from "@client/lib/server-api";
import { notFound } from "@tanstack/solid-router";
import { createSignal, For } from "solid-js";

export const Route = createFileRoute({
	component: RouteComponent,
	loader(ctx) {
		return { rounds: ctx.context.call.rounds };
	},
});

function RouteComponent() {
	const { rounds } = Route.useLoaderData()();
	const routeContext = Route.useRouteContext();
	const call = () => routeContext().call;
	const org = () => routeContext().org;

	const [newRoundName, setNewRoundName] = createSignal("");
	const [newRoundSlug, setNewRoundSlug] = createSignal("");
	const [isCreating, setIsCreating] = createSignal(false);

	const createRound = async () => {
		const name = newRoundName().trim();
		const slug = newRoundSlug().trim();

		if (!name || !slug) return;

		setIsCreating(true);
		try {
			const { error, status } = await server.api.host
				.orgs({ orgId: org().id })
				.calls({ callId: call().id })
				.rounds.post({
					name,
					slug,
					callId: call().id,
				});

			if (error) {
				console.error("Failed to create round:", error.value);
				return;
			}

			if (status === 201) {
				// Refresh the page to show the new round
				window.location.reload();
			}
		} catch (err) {
			console.error("Failed to create round:", err);
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<div class="space-y-6">
			<div>
				<h1 class="text-2xl font-bold">Rounds for {call().name}</h1>
				<p class="text-gray-600 mt-2">Manage rounds for this call</p>
			</div>

			{/* Create Round Form */}
			<div class="bg-white p-6 rounded-lg border">
				<h2 class="text-lg font-semibold mb-4">Create New Round</h2>
				<div class="space-y-4">
					<div>
						<label
							for="round-name"
							class="block text-sm font-medium text-gray-700 mb-1"
						>
							Round Name
						</label>
						<input
							id="round-name"
							type="text"
							value={newRoundName()}
							onInput={(e) => setNewRoundName(e.target.value)}
							placeholder="Enter round name"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div>
						<label
							for="round-slug"
							class="block text-sm font-medium text-gray-700 mb-1"
						>
							Round Slug
						</label>
						<input
							id="round-slug"
							type="text"
							value={newRoundSlug()}
							onInput={(e) => setNewRoundSlug(e.target.value)}
							placeholder="Enter round slug (URL-friendly)"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<button
						type="button"
						onClick={createRound}
						disabled={
							isCreating() || !newRoundName().trim() || !newRoundSlug().trim()
						}
						class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isCreating() ? "Creating..." : "Create Round"}
					</button>
				</div>
			</div>

			{/* Rounds List */}
			<div class="bg-white rounded-lg border">
				<div class="px-6 py-4 border-b">
					<h2 class="text-lg font-semibold">Existing Rounds</h2>
				</div>
				<div class="divide-y">
					<For
						each={rounds}
						fallback={
							<div class="px-6 py-8 text-center text-gray-500">
								No rounds created yet. Create your first round above.
							</div>
						}
					>
						{(round) => (
							<div class="px-6 py-4 hover:bg-gray-50">
								<div class="flex items-center justify-between">
									<div>
										<h3 class="font-medium text-gray-900">{round.name}</h3>
										<p class="text-sm text-gray-500">Slug: {round.slug}</p>
										{round.startDate && (
											<p class="text-sm text-gray-500">
												Start: {new Date(round.startDate).toLocaleDateString()}
											</p>
										)}
										{round.endDate && (
											<p class="text-sm text-gray-500">
												End: {new Date(round.endDate).toLocaleDateString()}
											</p>
										)}
									</div>
									<a
										href={`/host/orgs/${org().slug}/calls/${call().slug}/rounds/${round.slug}`}
										class="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
									>
										View Details
									</a>
								</div>
							</div>
						)}
					</For>
				</div>
			</div>
		</div>
	);
}
