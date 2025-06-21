import { Navigate } from "@tanstack/solid-router"

export const Route = createFileRoute({
  component: RouteComponent,
  loader: ({context: {orgs}}) => {
    return {
      orgs: orgs,
    };
  }
})

function RouteComponent() {
  const data = Route.useLoaderData();
  if (data().orgs.length === 0) {
    return <div>No organizations found.</div>
  }
  return <Navigate to="/host/orgs/$org" params={{ org: data().orgs[0].slug }} />
}
