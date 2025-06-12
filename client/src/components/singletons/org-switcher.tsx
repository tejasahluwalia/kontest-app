import { createEffect, createSignal, For, Show, Switch } from "solid-js";
import { getRouteApi, Navigate, useParams } from "@tanstack/solid-router";

import {
	IconCheck,
	IconFile,
	IconSelector,
	IconPlus,
} from "~/components/icons";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "~/components/ui/sidebar";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import CreateOrgForm from "@client/components/forms/create-org-form";

const routeApi = getRouteApi("/host/orgs/");

export function OrgSwitcher() {
	const { orgs } = routeApi.useLoaderData()();

	const { org: selectedOrgSlug } = useParams({
		strict: false,
	})();

	const [selectedOrg, setSelectedOrg] = createSignal(
		orgs.find((org) => org.slug === selectedOrgSlug) ?? orgs[0],
	);

	return (
		<Dialog>
			<SidebarMenu>
				<SidebarMenuItem>
					<Show when={orgs && orgs.length > 0}>
						<DropdownMenu placement="bottom-start">
							<DropdownMenuTrigger
								as={SidebarMenuButton}
								size="lg"
								class="data-[expanded]:bg-sidebar-accent data-[expanded]:text-sidebar-accent-foreground"
							>
								<div class="flex flex-col gap-0.5 leading-none">
									<span class="font-semibold">{selectedOrg().name}</span>
								</div>
								<IconSelector class="ml-auto" />
							</DropdownMenuTrigger>
							<DropdownMenuContent class="w-[--kb-popper-anchor-width]">
								<For each={orgs}>
									{(org) => (
										<DropdownMenuItem
											class="w-full"
											onSelect={() => {
												setSelectedOrg(org);
											}}
										>
											{org.name}{" "}
											{org === selectedOrg() && <IconCheck class="ml-auto" />}
										</DropdownMenuItem>
									)}
								</For>
								<DropdownMenuItem as={CreateOrgButton} />
							</DropdownMenuContent>
						</DropdownMenu>
					</Show>
				</SidebarMenuItem>
			</SidebarMenu>
			<DialogContent>
				<CreateOrgForm />
			</DialogContent>
		</Dialog>
	);
}

function CreateOrgButton() {
	return (
		<DialogTrigger as={SidebarMenuButton} size="md">
			<div class="flex aspect-square size-6 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
				<IconPlus class="size-3" />
			</div>
			<div class="flex flex-col gap-0.5 leading-none">
				<span class="font-semibold">Create Org</span>
			</div>
		</DialogTrigger>
	);
}
