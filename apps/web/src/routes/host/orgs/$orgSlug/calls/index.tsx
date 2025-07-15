import { Link, useRouter } from "@tanstack/solid-router";
import Trash2 from "lucide-solid/icons/trash-2";
import { createSignal, For, Show } from "solid-js";
import NewCallForm from "~/components/forms/new-call-form";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import server from "~/lib/server-api";

export const Route = createFileRoute({
	component: RouteComponent,
	loader: async ({ context: { member } }) => {
		return { org: member.org };
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
								<DialogPortal>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Create a new call</DialogTitle>
										</DialogHeader>
										<NewCallForm
											orgId={org.id}
											onSuccess={handleCreateSuccess}
										/>
									</DialogContent>
								</DialogPortal>
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
											from="/host/orgs/$orgSlug/calls"
											to="/host/orgs/$orgSlug/calls/$callSlug/dashboard"
											params={{
												orgSlug: org.slug,
												callSlug: slug,
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
											<Trash2 size={16} />
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
