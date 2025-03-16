import server from "@client/lib/server-api";
import { Outlet, createFileRoute, redirect } from "@tanstack/solid-router";

export const Route = createFileRoute("/host")({
  beforeLoad: async ({ context: { auth }, location }) => {
    const { data, error } = await auth();
    if (!data) {
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
