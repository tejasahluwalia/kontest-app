import NewOrgForm from "~/components/forms/new-org-form";

export const Route = createFileRoute({
	component: RouteComponent,
});

function RouteComponent() {
	return <NewOrgForm />;
}
