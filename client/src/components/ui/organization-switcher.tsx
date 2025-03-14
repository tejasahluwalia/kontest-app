import { createSignal, For } from "solid-js";
import { getRouteApi } from "@tanstack/solid-router";

import { IconCheck, IconFile, IconSelector } from "~/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./sidebar";

const routeApi = getRouteApi("/host");

export function OrganizationSwitcher() {
  const data = routeApi.useLoaderData();
  const organizations = data().organizations;

  const [selectedOrganization, setSelectedOrganization] = createSignal(
    organizations[0],
  );
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu placement="bottom-start">
          <DropdownMenuTrigger
            as={SidebarMenuButton}
            size="lg"
            class="data-[expanded]:bg-sidebar-accent data-[expanded]:text-sidebar-accent-foreground"
          >
            <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <IconFile class="size-4" />
            </div>
            <div class="flex flex-col gap-0.5 leading-none">
              <span class="font-semibold">{selectedOrganization().name}</span>
            </div>
            <IconSelector class="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-[--kb-popper-anchor-width]">
            <For each={organizations}>
              {(organization) => (
                <DropdownMenuItem
                  onSelect={() => setSelectedOrganization(organization)}
                >
                  {organization.name}{" "}
                  {organization === selectedOrganization() && (
                    <IconCheck class="ml-auto" />
                  )}
                </DropdownMenuItem>
              )}
            </For>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
