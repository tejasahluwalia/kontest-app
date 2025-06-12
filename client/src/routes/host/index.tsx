import server from "@client/lib/server-api";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { For, Show } from "solid-js";

export const Route = createFileRoute("/host/")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Kaulf",
			},
		],
	}),
	loader: async ({ context: { auth } }) => {
		const data = await server.api.host.orgs.get();
		return {
			user: auth.user,
			orgs: data,
		};
	},
});

function RouteComponent() {
	const data = Route.useLoaderData();
	return (
		<Show when={data().user}>
			<div>Hello {data().user.email}!</div>
			<Show when={data().orgs.data}>
				<For each={data().orgs.data}>
					{(org) => (
						<Link to={"/host/orgs/$org"} params={{ org: org.slug }}>
							{org.name}
						</Link>
					)}
				</For>
			</Show>
		</Show>
	);
}
