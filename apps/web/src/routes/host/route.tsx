import { useQuery } from "@tanstack/solid-query";
import { Outlet, redirect } from "@tanstack/solid-router";
import HostNavbar from "~/components/layouts/host-navbar";
import MemberProfilesContext from "~/context/memberProfiles";
import { memberProfilesQueryOptions } from "~/lib/queries";

export const Route = createFileRoute({
	component: RouteComponent,
	beforeLoad: async ({ context: { auth } }) => {
		const authData = await auth();
		if (!authData.data) {
			throw redirect({
				to: "/login",
			});
		}

		return {
			auth: authData.data,
			memberProfilesQueryOptions,
		};
	},
	loader: async ({ context: { queryClient, memberProfilesQueryOptions } }) => {
		await queryClient.ensureQueryData(memberProfilesQueryOptions());
	},
});

function RouteComponent() {
	const { memberProfilesQueryOptions } = Route.useRouteContext()();
	const { isPending, isError, data, error } = useQuery(() =>
		memberProfilesQueryOptions(),
	);

	if (isPending) return <span>...Loading</span>;
	if (isError) return <span>{JSON.stringify(error)}</span>;

	return (
		<MemberProfilesContext.Provider value={data}>
			<HostNavbar />
			<div class="container py-6">
				<Outlet />
			</div>
		</MemberProfilesContext.Provider>
	);
}
