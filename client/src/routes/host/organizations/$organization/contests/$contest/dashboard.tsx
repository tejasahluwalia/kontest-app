import { createFileRoute, notFound } from "@tanstack/solid-router";
import server from "@client/lib/server-api";

export const Route = createFileRoute(
  "/host/organizations/$organization/contests/$contest/dashboard",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const routeContext = Route.useRouteContext();
  // Safely access the contest property with type assertion
  const contest = () => routeContext().contest;
  return <div>Hello {contest().name}!</div>;
}
