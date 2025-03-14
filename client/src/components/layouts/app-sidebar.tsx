import { For } from "solid-js";
import { Link } from "@tanstack/solid-router";

import {
  IconCalendar,
  IconHome,
  IconMail,
  IconSearch,
  IconSettings,
} from "~/components/icons";
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

const items = [
  {
    title: "Home",
    url: "#",
    icon: IconHome,
  },
  {
    title: "Inbox",
    url: "#",
    icon: IconMail,
  },
  {
    title: "Calendar",
    url: "#",
    icon: IconCalendar,
  },
  {
    title: "Search",
    url: "#",
    icon: IconSearch,
  },
  {
    title: "Settings",
    url: "#",
    icon: IconSettings,
  },
];

export function AppSidebar({
  variant,
}: {
  variant?: "sidebar" | "inset" | "floating";
}) {
  return (
    <Sidebar variant={variant}>
      <SidebarHeader>
        <OrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <For each={items}>
                {(item) => (
                  <SidebarMenuItem>
                    <SidebarMenuButton as={Link} to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </For>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

import { SidebarTrigger } from "~/components/ui/sidebar";
import { OrganizationSwitcher } from "../ui/organization-switcher";

export function AppSidebarHeader() {
  return (
    <header class="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
      <div class="flex items-center gap-2">
        <SidebarTrigger class="-ml-1" />
      </div>
    </header>
  );
}
