import { Outlet, createFileRoute, redirect } from "@tanstack/solid-router";

export const Route = createFileRoute("/host")({
	beforeLoad: async ({ context: { auth } }) => {
		const { data, error } = await auth();
		if (!data) {
			console.log(error);
			throw redirect({
				to: "/login",
			});
		}
		return {
			auth: data,
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
