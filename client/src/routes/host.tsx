import server from "@client/lib/server-api";
import {
  Outlet,
  createFileRoute,
  redirect,
} from "@tanstack/solid-router";

async function fetchOrganizations() {
  const { data, error, status } = await server.api.organizations.index.get();
  if (error) {
    throw error.value;
  }
  if (status !== 200) {
    throw new Error(`Failed to fetch organizations: ${status}`);
  }
  return data;
}

export const Route = createFileRoute("/host")({
  beforeLoad: async ({ context: { auth }, location }) => {
    const { data, error } = await auth();
    if (!data) {
      throw redirect({
        to: "/login",
      });
    }
    return {
      data,
    };
  },
  loader: async (ctx) => {
    const organizations = await fetchOrganizations();
    return { organizations };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
