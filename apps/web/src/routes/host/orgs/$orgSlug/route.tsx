import { notFound, Outlet } from "@tanstack/solid-router";
import { useContext } from "solid-js";
import MemberProfilesContext from "~/context/memberProfiles";
import OrgContext from "~/context/org";

export const Route = createFileRoute({
	component: RouteComponent,
});

function RouteComponent() {
	const { orgSlug } = Route.useParams()();
	const memberProfiles = useContext(MemberProfilesContext);
	if (!memberProfiles) return <span>...Loading</span>;
	const org = memberProfiles.orgs.find((org) => org.slug === orgSlug);
	return (
		<OrgContext.Provider value={org}>
			<Outlet />
		</OrgContext.Provider>
	);
}
