import server from "@client/lib/server-api";
import { createFileRoute, Navigate, Outlet } from "@tanstack/solid-router";

export const Route = createFileRoute("/host/orgs/$org/")({
  component: RouteComponent,
  loader: ({ context: { org } }) => {
    return { org };
  },
});

function RouteComponent() {
  const { org } = Route.useLoaderData()();
  return (
    <Navigate
      to="/host/orgs/$org/calls"
      params={{ org: org.slug }}
    />
  );
}
