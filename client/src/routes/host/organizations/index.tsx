import CreateOrganizationForm from "@client/components/forms/create-organization-form";
import { createFileRoute, useLoaderData } from "@tanstack/solid-router";

export const Route = createFileRoute("/host/organizations/")({
  component: RouteComponent,
  loader: async ({ context: { organizations } }) => {
    return { organizations };
  },
});

function RouteComponent() {
  return (
    <div>
      <CreateOrganizationForm />
    </div>
  );
}
