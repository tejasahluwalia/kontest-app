import { Link } from "@tanstack/solid-router";
import { Navigate } from "@tanstack/solid-router";
import { For } from "solid-js";

export const Route = createFileRoute({
	component: RouteComponent,
	loader: ({ context: { org } }) => {
		return { org };
	},
});

function RouteComponent() {
	const { org } = Route.useLoaderData()();
	return (
		<div>
			<For each={org.calls}>
				{(call) => (
					<div>
						<Link
							to="/host/orgs/$org/calls/$call"
							params={{ org: org.slug, call: call.slug }}
						>
							{call.name}
						</Link>
					</div>
				)}
			</For>
		</div>
	);
}
