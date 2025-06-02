import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute(
  "/host/orgs/$org/calls/$call/entries",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/host/calls/$call/entries"!</div>;
}
