import server from '@client/lib/server-api';
import { createFileRoute, Navigate, Outlet } from '@tanstack/solid-router'

export const Route = createFileRoute('/host/organizations/$organization/')({
  component: RouteComponent,
  loader: async ({params}) => {
    const { data, error, status } = await server.api.organizations({organizationSlug: params.organization}).index.get();
    if (error) {
      throw error.value;
    }
    if (status !== 200) {
      throw new Error(`Failed to fetch organization: ${status}`);
    }
    return {
      organization: data,
    };
  },
})

function RouteComponent() {
  const data = Route.useLoaderData()();
  return (
    <Navigate to="/host/organizations/$organization/contests" params={{ organization: data.organization.slug }} />
  );
}
