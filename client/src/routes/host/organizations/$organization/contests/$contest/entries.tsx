import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute(
  "/host/organizations/$organization/contests/$contest/entries",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/host/contests/$contest/entries"!</div>;
}
