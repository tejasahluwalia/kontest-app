import NewRoundForm from "~/components/forms/new-round-form";
import { Badge } from "~/components/ui/badge";
import type { ButtonProps } from "~/components/ui/button";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import type { ButtonRootOptions } from "@kobalte/core/button";
import type { PolymorphicCallbackProps } from "@kobalte/core/polymorphic";
import type { LinkComponent } from "@tanstack/solid-router";
import { Link, useRouter } from "@tanstack/solid-router";
import { createSignal, For } from "solid-js";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";

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

	return (
		<div class="space-y-6">
			<div>
				<h1 class="text-2xl font-bold">Rounds for {call().name}</h1>
			</div>

			<div class="space-y-4">
				<For
					each={rounds}
					fallback={
						<div class="text-center text-muted-foreground py-8">
							<NewCallDialog orgId={org().id} callId={call().id} />
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
											Start: {new Date(round.startDate).toLocaleDateString()}
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
											to={"/host/orgs/$org/calls/$call/rounds/$round/dashboard"}
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
				<NewCallDialog orgId={org().id} callId={call().id} />
			</div>
		</div>
	);
}

function NewCallDialog(props: { orgId: string; callId: string }) {
	const [dialogOpen, setDialogOpen] = createSignal(false);
	const router = useRouter();

	function handleCreateSuccess() {
		setDialogOpen(false);
		router.invalidate();
	}
	return (
		<Dialog open={dialogOpen()} onOpenChange={setDialogOpen}>
			<DialogTrigger>
				<Button>Create Round</Button>
			</DialogTrigger>
			<DialogPortal>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create a new call</DialogTitle>
					</DialogHeader>
					<NewRoundForm
						callId={props.callId}
						orgId={props.orgId}
						onSuccess={handleCreateSuccess}
					/>
				</DialogContent>
			</DialogPortal>
		</Dialog>
	);
}
