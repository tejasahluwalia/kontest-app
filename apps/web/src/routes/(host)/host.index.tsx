import NewOrgForm from "~/components/forms/new-org-form";
import { Navigate } from "@tanstack/solid-router";

export const Route = createFileRoute({
  component: RouteComponent,
  loader: ({ context: { orgs } }) => {
    return {
      orgs: orgs,
    };
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  if (data().orgs.length === 0) {
    return <Navigate to="/host/orgs/new" />;
  }
  return (
    <Navigate
      to="/host/orgs/$org/calls"
      params={{ org: data().orgs[0].slug }}
    />
  );
}
