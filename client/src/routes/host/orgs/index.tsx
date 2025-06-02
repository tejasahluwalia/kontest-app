import CreateOrgForm from "@client/components/forms/create-org-form";
import { createFileRoute, useLoaderData } from "@tanstack/solid-router";

export const Route = createFileRoute("/host/orgs/")({
  component: RouteComponent,
  loader: async ({ context: { orgs } }) => {
    return { orgs };
  },
});

function RouteComponent() {
  return (
    <div>
      <CreateOrgForm />
    </div>
  );
}
