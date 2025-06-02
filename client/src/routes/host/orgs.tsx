import server from "@client/lib/server-api";
import { createFileRoute, Navigate, Outlet } from "@tanstack/solid-router";
import { Show } from "solid-js";

export const Route = createFileRoute("/host/orgs")({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data, error, status } = await server.api.orgs.get();
    if (error) {
      throw error.value;
    }
    if (status !== 200) {
      throw new Error(`Failed to fetch orgs: ${status}`);
    }
    return { orgs: data };
  },
  loader: ({ context: { orgs } }) => {
    return { orgs };
  },
});

function RouteComponent() {
  const { orgs } = Route.useLoaderData()();
  return (
    <>
      <Outlet />
    </>
  );
}
