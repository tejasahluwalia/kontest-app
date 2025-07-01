import NewOrgForm from "~/components/forms/new-org-form";
import { Navigate } from "@tanstack/solid-router";

export const Route = createFileRoute({
  component: RouteComponent,
});

function RouteComponent() {
  return <NewOrgForm />;
}
