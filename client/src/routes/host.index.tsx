import server from "@client/lib/server-api";
import { Outlet, createFileRoute, Navigate, redirect, useRouter } from "@tanstack/solid-router";
import { Show, For } from "solid-js";
import { AppSidebar } from "@client/components/layouts/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"

async function fetchOrganizations(token: string) {
  const { data, error, status } = await server.api.organizations.index.get();
  if (error) {
    throw error.value;
  }
  if (status !== 200) {
    throw new Error(`Failed to fetch organizations: ${status}`);
  }
  return data;
}

export const Route = createFileRoute("/host/")({
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
    const { data } = ctx.context;
    const organizations = await fetchOrganizations(data.session.token);
    return { organizations };
  },

  component: RouteComponent,
});

function RouteComponent() {
  const loaderData = Route.useLoaderData();
  const organizations = loaderData().organizations;

  return (
    <SidebarProvider>
      <AppSidebar />
      <div class="container mx-auto p-4">
        <SidebarTrigger />
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
