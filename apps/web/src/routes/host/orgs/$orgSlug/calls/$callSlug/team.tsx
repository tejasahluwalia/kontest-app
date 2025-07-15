import { For, Show } from "solid-js";
import {
	Table,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import server from "~/lib/server-api";

export const Route = createFileRoute({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const { org, call } = context;
		const { data, error } = await server.api.host
			.orgs({ orgId: org.id })
			.calls({ callId: call.id })
			.team.get();

		if (error) {
			throw error.value;
		}
		return { team: data };
	},
	loader: ({ context }) => {
		return { team: context.team };
	},
});

function RouteComponent() {
	const data = Route.useLoaderData()();

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
				</TableRow>
			</TableHeader>
			<Show when={data}>
				<For each={data.team}>
					{({ member }) => (
						<TableRow>
							<TableCell>{member.user.name}</TableCell>
							<TableCell>{member.user.email}</TableCell>
							<TableCell>{member.role}</TableCell>
						</TableRow>
					)}
				</For>
			</Show>
		</Table>
	);
}
