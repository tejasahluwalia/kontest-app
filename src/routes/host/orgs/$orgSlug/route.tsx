import { createFileRoute, notFound, Outlet } from "@tanstack/solid-router";
import { useContext } from "solid-js";
import MemberProfilesContext from "~/context/memberProfiles";
import OrgContext from "~/context/org";

export const Route = createFileRoute("/host/orgs/$orgSlug")({
	component: RouteComponent,
});

function RouteComponent() {
	const { orgSlug } = Route.useParams()();
	const memberProfiles = useContext(MemberProfilesContext);
	if (!memberProfiles) return null;

	const org = (memberProfiles || []).find((mp: any) => mp.org.slug === orgSlug);
	if (!org) return notFound();

	return (
		<OrgContext value={org}>
			<Outlet />
		</OrgContext>
	);
}
