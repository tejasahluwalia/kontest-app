import { createFileRoute, Link, useRouter } from "@tanstack/solid-router";
import { createSignal, For, Show, useContext } from "solid-js";
import NewRoundForm from "~/components/forms/new-round-form";
import { Button } from "~/components/ui/button";
import { Card, CardHeader } from "~/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import CallContext from "~/context/call";
import OrgContext from "~/context/org";

export const Route = createFileRoute(
	"/host/orgs/$orgSlug/calls/$callSlug/rounds/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const call = useContext(CallContext);
	const org = useContext(OrgContext);
	const rounds = () => call?.rounds || [];

	return (
		<div class="space-y-6">
			<div>
				<h1 class="text-2xl font-bold">Rounds for {call?.name}</h1>
			</div>

			<div class="grid">
				<For
					each={rounds()}
					fallback={
						<div class="text-muted-foreground py-8">No rounds created yet.</div>
					}
				>
					{(round) => (
						<Link
							to="/host/orgs/$orgSlug/calls/$callSlug/rounds/$roundSlug/configure"
							from="/host/orgs/$orgSlug/calls/$callSlug/rounds/"
							params={(prev: any) => ({ ...prev, roundSlug: round.slug })}
						>
							<Card class="p-4">
								<CardHeader>
									<h3 class="font-medium">{round.name}</h3>
								</CardHeader>
							</Card>
						</Link>
					)}
				</For>
			</div>
			<Show when={org && call}>
				<NewCallDialog orgSlug={org!.slug} callId={call!.id} />
			</Show>
		</div>
	);
}

function NewCallDialog(props: { orgSlug: string; callId: string }) {
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
						orgSlug={props.orgSlug}
						onSuccess={handleCreateSuccess}
					/>
				</DialogContent>
			</DialogPortal>
		</Dialog>
	);
}
