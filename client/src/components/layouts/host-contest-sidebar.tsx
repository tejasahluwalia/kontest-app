import { createEffect, For } from "solid-js";

import {
  IconCalendar,
  IconHome,
  IconMail,
  IconSearch,
  IconSettings,
} from "~/components/icons";
import type { Icon } from "~/components/icons";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { getRouteApi, MatchRoute, useParams, type LinkComponent } from "@tanstack/solid-router";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Link } from "@tanstack/solid-router";

const routeApi = getRouteApi("/host/contests/$contest");

export function AppSidebar({
  variant,
}: {
  variant?: "sidebar" | "inset" | "floating";
}) {
  const { contest } = routeApi.useParams()();

  return (
    <Sidebar variant={variant}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Contest</SidebarGroupLabel>
          <SidebarGroupContent>
            <ContestMenu contest={contest} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function AppSidebarHeader() {
  return (
    <header class="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
      <div class="flex items-center gap-2"></div>
    </header>
  );
}

function ContestMenu({ contest }: { contest: string }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <MatchRoute to="/host/contests/$contest" params={{ contest }}>
          {(match) => <>
            <SidebarMenuButton isActive={Boolean(match)}>
              <Link class="w-full" from="/host/contests/$contest" to="/host/contests/$contest" params={{ contest }}>Dashboard</Link>
            </SidebarMenuButton>
          </>}
        </MatchRoute>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <MatchRoute to="/host/contests/$contest/entries" params={{ contest }}>
          {(match) => <>
            <SidebarMenuButton isActive={Boolean(match)}>
              <Link class="w-full" from="/host/contests/$contest" to="/host/contests/$contest/entries" params={{ contest }}>Entries</Link>
            </SidebarMenuButton>
          </>}
        </MatchRoute>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}