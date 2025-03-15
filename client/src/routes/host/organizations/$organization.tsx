import { createFileRoute } from '@tanstack/solid-router'
import {
  AppSidebar,
} from "@client/components/layouts/host-organization-sidebar";
import {
  SidebarProvider,
} from "~/components/ui/sidebar";
import { Outlet } from "@tanstack/solid-router";

export const Route = createFileRoute('/host/organizations/$organization')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main class="w-full p-4">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
