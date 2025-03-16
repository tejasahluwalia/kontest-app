import { createFileRoute, Outlet } from "@tanstack/solid-router";

export const Route = createFileRoute(
  "/host/organizations/$organization/contests",
)({
  component: RouteComponent,
});

function RouteComponent() {

  return (
    <Outlet />
  );
}
