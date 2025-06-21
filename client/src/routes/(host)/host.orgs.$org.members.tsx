import server from "@client/lib/server-api";
import { For } from "solid-js";

export const Route = createFileRoute({
	component: RouteComponent,
	loader: async ({ context: { org } }) => {
		const orgId = org.id;
		const { data, error, status } = await server.api.host
			.orgs({ orgId })
			.members.get();
		if (error) {
			throw error.value;
		}
		if (status !== 200) {
			throw new Error(`Failed to fetch call: ${status}`);
		}
		return { members: data };
	},
});

function RouteComponent() {
	const data = Route.useLoaderData()();
	return (
		<div>
			<For each={data.members}>
				{(member) => (
					<div>
						{member.user.email}, {member.role}
					</div>
				)}
			</For>
		</div>
	);
}
