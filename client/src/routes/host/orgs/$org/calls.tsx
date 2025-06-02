import { createFileRoute, Outlet } from "@tanstack/solid-router";

export const Route = createFileRoute(
  "/host/orgs/$org/calls"
)({
  component: RouteComponent,
});

function RouteComponent() {

  return (
    <Outlet />
  );
}
