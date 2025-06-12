import CreateOrgForm from "@client/components/forms/create-org-form";
import { createFileRoute, useLoaderData } from "@tanstack/solid-router";
import { For, Show } from "solid-js";

export const Route = createFileRoute("/host/orgs/")({
	component: RouteComponent,
	loader: async ({ context: { orgs } }) => {
		return { orgs };
	},
});

function RouteComponent() {
	const { orgs } = Route.useLoaderData()();
	return (
		<div>
			<Show when={orgs.length > 0} fallback={<CreateOrgForm />}>
				<For each={orgs}>
					{(org) => <a href={`/host/orgs/${org.slug}`}>{org.name}</a>}
				</For>
			</Show>
		</div>
	);
}
