import { createEffect, For, Show, Switch, type ComponentProps } from "solid-js";

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
import { OrgSwitcher } from "../singletons/org-switcher";
import { Link } from "@tanstack/solid-router";
import { Match } from "solid-js";

export function AppSidebar({
	variant,
}: {
	variant?: "sidebar" | "inset" | "floating";
}) {
	const params = useParams({ strict: false });
	const org = () => params().org;
	const call = () => params().call;

	return (
		<Sidebar variant={variant}>
			<SidebarHeader>
				<Switch>
					<Match when={org() && !call()}>
						<OrgSwitcher />
					</Match>
				</Switch>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>
						<Show when={org() && !call()}>Org</Show>
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<Show when={org() && !call()}>
							<OrgMenu org={org()} />
						</Show>
						<Show when={org() && call()}>
							<CallMenu org={org()} call={call()} />
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

function OrgMenu({ org }: { org?: string }) {
	if (!org) return null;
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<MatchRoute
					to="/host/orgs/$org/calls"
					params={{ org }}
				>
					{(match) => (
						<>
							<SidebarMenuButton
								as={(props: ComponentProps<"a">) => (
									<Link
										class="w-full"
										to="/host/orgs/$org/calls"
										params={{ org }}
                    {...props}
									>
										Calls
									</Link>
								)}
								isActive={Boolean(match)}
							/>
						</>
					)}
				</MatchRoute>
			</SidebarMenuItem>
			<SidebarMenuItem>
				<MatchRoute
					to="/host/orgs/$org/members"
					params={{ org }}
				>
					{(match) => (
						<>
							<SidebarMenuButton
								as={(props: ComponentProps<"a">) => (
									<Link
										class="w-full"
										to="/host/orgs/$org/members"
										params={{ org }}
                    {...props}
									>
										Members
									</Link>
								)}
								isActive={Boolean(match)}
							/>
						</>
					)}
				</MatchRoute>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

function CallMenu({
	org,
	call,
}: { org?: string; call?: string }) {
	if (!org || !call) return null;
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<MatchRoute
					to="/host/orgs/$org/calls/$call/dashboard"
					params={{ call }}
				>
					{(match) => (
						<>
							<SidebarMenuButton isActive={Boolean(match)}>
								<Link
									class="w-full"
									to="/host/orgs/$org/calls/$call/dashboard"
									params={{ org, call }}
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
					to="/host/orgs/$org/calls/$call/configure"
					params={{ call }}
				>
					{(match) => (
						<>
							<SidebarMenuButton isActive={Boolean(match)}>
								<Link
									class="w-full"
									to="/host/orgs/$org/calls/$call/configure"
									params={{ org, call }}
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
