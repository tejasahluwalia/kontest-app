import { createFileRoute } from "@tanstack/solid-router";
import NewOrgForm from "~/components/forms/new-org-form";

export const Route = createFileRoute("/host/orgs/new")({
	component: RouteComponent,
});

function RouteComponent() {
	return <NewOrgForm />;
}
