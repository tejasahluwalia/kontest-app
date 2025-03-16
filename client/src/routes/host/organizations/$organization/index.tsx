import server from "@client/lib/server-api";
import { createFileRoute, Navigate, Outlet } from "@tanstack/solid-router";

export const Route = createFileRoute("/host/organizations/$organization/")({
  component: RouteComponent,
  loader: ({ context: { organization } }) => {
    return { organization };
  },
});

function RouteComponent() {
  const { organization } = Route.useLoaderData()();
  return (
    <Navigate
      to="/host/organizations/$organization/contests"
      params={{ organization: organization.slug }}
    />
  );
}
