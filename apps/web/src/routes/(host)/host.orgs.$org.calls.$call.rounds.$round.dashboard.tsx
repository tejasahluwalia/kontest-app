import { Badge } from "~/components/ui/badge";
import type { ButtonProps } from "~/components/ui/button";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import RoundContext from "~/context/round";
import server from "~/lib/server-api";
import type { ButtonRootOptions } from "@kobalte/core/button";
import type { PolymorphicCallbackProps } from "@kobalte/core/polymorphic";
import {
	Link,
	type LinkComponentProps,
	notFound,
	Outlet,
} from "@tanstack/solid-router";

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
				<Card>
					<CardHeader>
						<div class="flex items-center justify-between">
							<div>
								<CardTitle>{round.name}</CardTitle>
								<CardDescription class="flex items-center gap-2 mt-1">
									<Badge variant="outline">{round.slug}</Badge>
								</CardDescription>
							</div>
							<Button
								as={(
									props: PolymorphicCallbackProps<
										LinkComponentProps,
										ButtonProps,
										ButtonRootOptions
									>,
								) => (
									<Link
										from={Route.fullPath}
										to={"/host/orgs/$org/calls/$call/rounds/$round/configure"}
										{...props}
									/>
								)}
							>
								Configure Round
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div class="space-y-4">
								<h3 class="font-semibold">Round Information</h3>
								<Separator />
								<div class="space-y-2">
									{round.startDate && (
										<p class="text-sm">
											<span class="font-medium text-foreground">
												Start Date:
											</span>{" "}
											<span class="text-muted-foreground">
												{new Date(round.startDate).toLocaleString()}
											</span>
										</p>
									)}
									{round.endDate && (
										<p class="text-sm">
											<span class="font-medium text-foreground">End Date:</span>{" "}
											<span class="text-muted-foreground">
												{new Date(round.endDate).toLocaleString()}
											</span>
										</p>
									)}
									<p class="text-sm">
										<span class="font-medium text-foreground">Created:</span>{" "}
										<span class="text-muted-foreground">
											{new Date(round.createdAt).toLocaleString()}
										</span>
									</p>
								</div>
							</div>

							<div class="space-y-4">
								<h3 class="font-semibold">Form Configuration</h3>
								<Separator />
								<div class="space-y-2">
									<p class="text-sm">
										<span class="font-medium text-foreground">
											Form Schema:
										</span>{" "}
										<Badge variant={round.formSchema ? "success" : "warning"}>
											{round.formSchema ? "Configured" : "Not configured"}
										</Badge>
									</p>
									<p class="text-sm">
										<span class="font-medium text-foreground">
											Judging Schema:
										</span>{" "}
										<Badge
											variant={round.judgingSchema ? "success" : "warning"}
										>
											{round.judgingSchema ? "Configured" : "Not configured"}
										</Badge>
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Outlet />
			</div>
		</RoundContext.Provider>
	);
}
