import { createEffect, For, Show, Switch } from "solid-js";

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
import {
  getRouteApi,
  MatchRoute,
  useParams,
  type LinkComponent,
} from "@tanstack/solid-router";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { OrganizationSwitcher } from "../singletons/organization-switcher";
import { Link } from "@tanstack/solid-router";
import { Match } from "solid-js";

export function AppSidebar({
  variant,
}: {
  variant?: "sidebar" | "inset" | "floating";
}) {
  const params = useParams({ strict: false })
  const organization = () => params().organization
  const contest = () => params().contest

  return (
    <Sidebar variant={variant}>
      <SidebarHeader>
        <Switch>
          <Match when={organization() && !contest()}>
            <OrganizationSwitcher />
          </Match>
        </Switch>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Show when={organization() && !contest()}>
              Organization
            </Show>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <Show when={organization() && !contest()}>
              <OrganizationMenu organization={organization()} />
            </Show>
            <Show when={organization() && contest()}>
              <ContestMenu organization={organization()} contest={contest()} />
            </Show>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function AppSidebarHeader() {
  return (
    <header class="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
      <div class="flex items-center gap-2" />
    </header>
  );
}

function OrganizationMenu({ organization }: { organization?: string }) {
  if (!organization) return null;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <MatchRoute
          to="/host/organizations/$organization/contests"
          params={{ organization }}
        >
          {(match) => (
            <>
              <SidebarMenuButton isActive={Boolean(match)}>
                <Link
                  class="w-full"
                  to="/host/organizations/$organization/contests"
                  params={{ organization }}
                >
                  Contests
                </Link>
              </SidebarMenuButton>
            </>
          )}
        </MatchRoute>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <MatchRoute
          to="/host/organizations/$organization/members"
          params={{ organization }}
        >
          {(match) => (
            <>
              <SidebarMenuButton isActive={Boolean(match)}>
                <Link
                  class="w-full"
                  to="/host/organizations/$organization/members"
                  params={{ organization }}
                >
                  Members
                </Link>
              </SidebarMenuButton>
            </>
          )}
        </MatchRoute>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function ContestMenu({ organization, contest }: { organization?: string; contest?: string }) {
  if (!organization || !contest) return null;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <MatchRoute
          to="/host/organizations/$organization/contests/$contest/dashboard"
          params={{ contest }}
        >
          {(match) => (
            <>
              <SidebarMenuButton isActive={Boolean(match)}>
                <Link
                  class="w-full"
                  to="/host/organizations/$organization/contests/$contest/dashboard"
                  params={{ organization, contest }}
                >
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </>
          )}
        </MatchRoute>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <MatchRoute
          to="/host/organizations/$organization/contests/$contest/configure"
          params={{ contest }}
        >
          {(match) => (
            <>
              <SidebarMenuButton isActive={Boolean(match)}>
                <Link
                  class="w-full"
                  to="/host/organizations/$organization/contests/$contest/configure"
                  params={{ organization, contest }}
                >
                  Form Configuration
                </Link>
              </SidebarMenuButton>
            </>
          )}
        </MatchRoute>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}