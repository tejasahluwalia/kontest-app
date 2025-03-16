import server from "@client/lib/server-api";
import { createFileRoute, Navigate, Outlet } from "@tanstack/solid-router";
import { Show } from "solid-js";

export const Route = createFileRoute("/host/organizations")({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data, error, status } = await server.api.organizations.index.get();
    if (error) {
      throw error.value;
    }
    if (status !== 200) {
      throw new Error(`Failed to fetch organizations: ${status}`);
    }
    return { organizations: data };
  },
  loader: ({ context: { organizations } }) => {
    return { organizations };
  },
});

function RouteComponent() {
  const { organizations } = Route.useLoaderData()();
  return (
    <>
      <Outlet />
    </>
  );
}
