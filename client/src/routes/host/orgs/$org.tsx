import { createFileRoute, getRouteApi, notFound } from "@tanstack/solid-router";
import { AppSidebar } from "@client/components/layouts/host-sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { Outlet } from "@tanstack/solid-router";
import server from "@client/lib/server-api";
import { ErrorBoundary } from "solid-js";
import OrgContext from "@client/context/org";

export const Route = createFileRoute("/host/orgs/$org")({
  component: RouteComponent,
  beforeLoad: async ({ params, context: { orgs } }) => {
    const orgId = orgs.find(
      (org) => org.slug === params.org,
    )?.id;
    if (!orgId) {
      throw notFound();
    }
    const { data, error, status } = await server.api
      .orgs({ orgSlug: params.org })
      .get({ query: { orgId } });
    if (error) {
      throw error.value;
    }
    if (status !== 200) {
      throw new Error(`Failed to fetch org: ${status}`);
    }
    return {
      org: data,
    };
  },
  loader: async ({ context: { org } }) => {
    return { org };
  },
});


function RouteComponent() {
  const { org } = Route.useLoaderData()();

  return (
    <OrgContext.Provider value={org}>
      <SidebarProvider>
        <ErrorBoundary fallback={<div>Error in Sidebar</div>}>
          <AppSidebar />
        </ErrorBoundary>
        <main class="w-full p-4">
          <Outlet />
        </main>
      </SidebarProvider>
    </OrgContext.Provider>
  );
}
