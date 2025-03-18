import ContestContext from '@client/context/contest';
import server from '@client/lib/server-api';
import { createFileRoute, notFound, Outlet } from '@tanstack/solid-router'

export const Route = createFileRoute(
  '/host/organizations/$organization/contests/$contest',
)({
  component: RouteComponent,
  beforeLoad: async ({ params, context: { organization } }) => {
    const { contests } = organization;
    const contestId = contests.find(
      (contest) => contest.slug === params.contest,
    )?.id;
    if (!contestId) throw notFound({ data: { message: "Contest not found" } });
    const { data, error, status } = await server.api
      .organizations({ organizationSlug: params.organization })
      .contests({ contestSlug: params.contest })
      .index.get({query: { organizationId: organization.id, contestId }});
    if (error) {
      throw error.value;
    }
    if (status !== 200) {
      throw new Error(`Failed to fetch contest: ${status}`);
    }
    return { contest: data };
  },
  loader(ctx) {
    return { contest: ctx.context.contest };
  },
})

function RouteComponent() {
  const { contest } = Route.useLoaderData()();
  return <ContestContext.Provider value={contest}><Outlet /></ContestContext.Provider>
}
