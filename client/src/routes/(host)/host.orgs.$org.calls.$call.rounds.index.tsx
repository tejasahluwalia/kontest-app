import { Badge } from "@client/components/ui/badge";
import type { ButtonProps } from "@client/components/ui/button";
import { Button } from "@client/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@client/components/ui/card";
import {
	TextField,
	TextFieldInput,
	TextFieldLabel,
} from "@client/components/ui/text-field";
import server from "@client/lib/server-api";
import type { ButtonRootOptions } from "@kobalte/core/button";
import type { PolymorphicCallbackProps } from "@kobalte/core/polymorphic";
import type { LinkComponent } from "@tanstack/solid-router";
import { Link, notFound } from "@tanstack/solid-router";
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
			<Card>
				<CardHeader>
					<CardTitle>Create New Round</CardTitle>
					<CardDescription>Add a new round to this call</CardDescription>
				</CardHeader>
				<CardContent class="space-y-4">
					<TextField>
						<TextFieldLabel for="round-name">Round Name</TextFieldLabel>
						<TextFieldInput
							id="round-name"
							type="text"
							value={newRoundName()}
							onInput={(e) => setNewRoundName(e.target.value)}
							placeholder="Enter round name"
						/>
					</TextField>
					<TextField>
						<TextFieldLabel for="round-slug">Round Slug</TextFieldLabel>
						<TextFieldInput
							id="round-slug"
							type="text"
							value={newRoundSlug()}
							onInput={(e) => setNewRoundSlug(e.target.value)}
							placeholder="Enter round slug (URL-friendly)"
						/>
					</TextField>
					<Button
						type="button"
						onClick={createRound}
						disabled={
							isCreating() || !newRoundName().trim() || !newRoundSlug().trim()
						}
					>
						{isCreating() ? "Creating..." : "Create Round"}
					</Button>
				</CardContent>
			</Card>

			{/* Rounds List */}
			<Card>
				<CardHeader>
					<CardTitle>Existing Rounds</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						<For
							each={rounds}
							fallback={
								<div class="text-center text-muted-foreground py-8">
									No rounds created yet. Create your first round above.
								</div>
							}
						>
							{(round) => (
								<Card class="p-4">
									<div class="flex items-center justify-between">
										<div class="space-y-1">
											<h3 class="font-medium">{round.name}</h3>
											<div class="flex items-center gap-2">
												<Badge variant="outline">{round.slug}</Badge>
											</div>
											{round.startDate && (
												<p class="text-sm text-muted-foreground">
													Start:{" "}
													{new Date(round.startDate).toLocaleDateString()}
												</p>
											)}
											{round.endDate && (
												<p class="text-sm text-muted-foreground">
													End: {new Date(round.endDate).toLocaleDateString()}
												</p>
											)}
										</div>
										<Button
											variant="outline"
											size="sm"
											as={(
												props: PolymorphicCallbackProps<
													LinkComponent<"a", string>,
													ButtonRootOptions,
													ButtonProps<"a">
												>,
											) => (
												<Link
													{...props}
													from={Route.fullPath}
													to={"/host/orgs/$org/calls/$call/rounds/$round"}
													params={(prev) => ({
														...prev,
														round: round.slug,
													})}
												/>
											)}
										>
											View Details
										</Button>
									</div>
								</Card>
							)}
						</For>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
