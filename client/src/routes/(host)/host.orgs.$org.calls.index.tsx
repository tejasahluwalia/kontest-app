import { Link, useRouter } from "@tanstack/solid-router";
import { Show, For, createSignal } from "solid-js";
import server from "@client/lib/server-api";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import NewCallForm from "@client/components/forms/new-call-form";
import { Card, CardContent, CardHeader } from "@client/components/ui/card";
import Trash2 from "lucide-solid/icons/trash-2";

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
			<div class="flex items-center justify-between">
				<h1 class="text-3xl font-bold">Calls</h1>
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

			<Show when={org}>
				<Show
					when={calls.length > 0}
					fallback={
						<div class="text-center py-12">
							<h3 class="text-lg font-medium">No calls found</h3>
							<p class="text-gray-500 dark:text-gray-400 mt-2">
								{calls.length
									? "Try a different search term"
									: "Create your first call to get started"}
							</p>
						</div>
					}
				>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<For each={calls}>
							{(call) => {
								const numberOfSubmissions = call.submissions?.length || 0;
								const numberOfParticipants =
									call.callToParticipant?.length || 0;
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
												<CardContent>
													<div class="flex items-center justify-between">
														<span class="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
															{numberOfSubmissions} submissions
														</span>
														<span class="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
															{numberOfParticipants} participants
														</span>
													</div>
												</CardContent>
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
					</div>
				</Show>
			</Show>
		</div>
	);
}
