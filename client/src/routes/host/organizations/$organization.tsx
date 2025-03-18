import { createFileRoute, getRouteApi, notFound } from "@tanstack/solid-router";
import { AppSidebar } from "@client/components/layouts/host-sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { Outlet } from "@tanstack/solid-router";
import server from "@client/lib/server-api";
import { ErrorBoundary } from "solid-js";
import OrganizationContext from "@client/context/organization";

export const Route = createFileRoute("/host/organizations/$organization")({
  component: RouteComponent,
  beforeLoad: async ({ params, context: { organizations } }) => {
    const organizationId = organizations.find(
      (org) => org.slug === params.organization,
    )?.id;
    if (!organizationId) {
      throw notFound();
    }
    const { data, error, status } = await server.api
      .organizations({ organizationSlug: params.organization })
      .index.get({ query: { organizationId } });
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
  loader: async ({ context: { organization } }) => {
    return { organization };
  },
});


function RouteComponent() {
  const { organization } = Route.useLoaderData()();

  return (
    <OrganizationContext.Provider value={organization}>
      <SidebarProvider>
        <ErrorBoundary fallback={<div>Error in Sidebar</div>}>
          <AppSidebar />
        </ErrorBoundary>
        <main class="w-full p-4">
          <Outlet />
        </main>
      </SidebarProvider>
    </OrganizationContext.Provider>
  );
}
