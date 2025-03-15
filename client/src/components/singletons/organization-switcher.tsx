import { createEffect, createSignal, For, Show, Switch } from "solid-js";
import { getRouteApi, Navigate, useParams } from "@tanstack/solid-router";

import { IconCheck, IconFile, IconSelector, IconPlus } from "~/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import CreateOrganizationForm from "@client/components/forms/create-organization-form";
import { useNavigate } from "@tanstack/solid-router";

const routeApi = getRouteApi("/host");

export function OrganizationSwitcher() {
  const data = routeApi.useLoaderData();
  const organizations = data().organizations;

  const { organization: selectedOrganizationSlug } = useParams({ strict: false })()

  const [selectedOrganization, setSelectedOrganization] = createSignal(
    organizations.find((org) => org.slug === selectedOrganizationSlug) ?? organizations[0],
  );

  const navigate = useNavigate();

  createEffect(() => {
    navigate({
      to: `/host/organizations/$organization`,
      params: {
        organization: selectedOrganization().slug,
      }
    })
  })

  return (
    <Dialog>
      <SidebarMenu>
        <SidebarMenuItem>
          <Show when={organizations && organizations.length > 0}>
            <DropdownMenu placement="bottom-start">
              <DropdownMenuTrigger
                as={SidebarMenuButton}
                size="lg"
                class="data-[expanded]:bg-sidebar-accent data-[expanded]:text-sidebar-accent-foreground"
              >
                <div class="flex flex-col gap-0.5 leading-none">
                  <span class="font-semibold">{selectedOrganization().name}</span>
                </div>
                <IconSelector class="ml-auto" />
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-[--kb-popper-anchor-width]">
                <For each={organizations}>
                  {(organization) => (
                    <DropdownMenuItem
                      class="w-full"
                      onSelect={() => {
                        setSelectedOrganization(organization);
                      }}
                    >
                      {organization.name}{" "}
                      {organization === selectedOrganization() && (
                        <IconCheck class="ml-auto" />
                      )}
                    </DropdownMenuItem>
                  )}
                </For>
                <DropdownMenuItem as={CreateOrganizationButton} />
              </DropdownMenuContent>
            </DropdownMenu>
          </Show>
        </SidebarMenuItem>
      </SidebarMenu>
      <DialogContent>
        <CreateOrganizationForm />
      </DialogContent>
    </Dialog>
  );
}

function CreateOrganizationButton() {
  return (
    <DialogTrigger as={SidebarMenuButton} size="md">
    <div class="flex aspect-square size-6 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
      <IconPlus class="size-3" />
    </div>
    <div class="flex flex-col gap-0.5 leading-none">
      <span class="font-semibold">Create Organization</span>
    </div>
  </DialogTrigger>
  )
}