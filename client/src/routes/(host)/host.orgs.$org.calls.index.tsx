import NewCallForm from "@client/components/forms/new-call-form";
import { Card, CardContent, CardHeader } from "@client/components/ui/card";
import server from "@client/lib/server-api";
import { Link, useRouter } from "@tanstack/solid-router";
import Trash2 from "lucide-solid/icons/trash-2";
import { createSignal, For, Show } from "solid-js";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";

export const Route = createFileRoute({
	component: RouteComponent,
	loader: async ({ context: { org } }) => {
		return { org };
	},
});

function RouteComponent() {
	const { org } = Route.useLoaderData()();
	const calls = org.calls;

	const router = useRouter();

	const [dialogOpen, setDialogOpen] = createSignal(false);

	const handleCreateSuccess = () => {
		setDialogOpen(false);
	};

	const deleteCall = (id: string) => {
		server.api.host.orgs({ orgId: org.id }).calls({ callId: id }).delete();
		router.invalidate();
	};

	return (
		<div class="space-y-6">
			<Show when={org}>
				<Show
					when={calls.length > 0}
					fallback={
						<div class="text-center py-12">
							<h3 class="text-lg font-medium mb-4">No calls found</h3>
							<p class="text-gray-500 dark:text-gray-400 mb-4">
								{calls.length
									? "Try a different search term"
									: "Create your first call to get started"}
							</p>
							<Dialog open={dialogOpen()} onOpenChange={setDialogOpen}>
								<DialogTrigger>
									<Button>Create Call</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Create a new call</DialogTitle>
									</DialogHeader>
									<NewCallForm orgId={org.id} onSuccess={handleCreateSuccess} />
								</DialogContent>
							</Dialog>
						</div>
					}
				>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<For each={calls}>
							{(call) => {
								const { slug, name, id } = call;
								return (
									<div>
										<Link
											from="/host/orgs/$org/calls"
											to="/host/orgs/$org/calls/$call/dashboard"
											params={{
												org: org.slug,
												call: slug,
											}}
											class="block"
										>
											<Card>
												<CardHeader class="flex items-center justify-between">
													<h3 class="text-xl font-semibold mb-2">{name}</h3>
												</CardHeader>
											</Card>
										</Link>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => deleteCall(id)}
										>
											<Trash2 class="h-4 w-4" />
										</Button>
									</div>
								);
							}}
						</For>
						<Card>
							<CardHeader>Create call</CardHeader>
							<Dialog open={dialogOpen()} onOpenChange={setDialogOpen}>
								<DialogTrigger>
									<Button>Create Call</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Create a new call</DialogTitle>
									</DialogHeader>
									<NewCallForm orgId={org.id} onSuccess={handleCreateSuccess} />
								</DialogContent>
							</Dialog>
						</Card>
					</div>
				</Show>
			</Show>
		</div>
	);
}
