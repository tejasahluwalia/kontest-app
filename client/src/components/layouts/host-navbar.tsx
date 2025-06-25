import { Button, type ButtonProps } from "@client/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@client/components/ui/dropdown-menu";
import { cn, useIsMobile } from "@client/lib/utils";
import type { PolymorphicCallbackProps } from "@kobalte/core";
import type { ButtonRootOptions } from "@kobalte/core/button";
import {
  getRouteApi,
  Link,
  type LinkComponent,
  type LinkComponentProps,
  MatchRoute,
  useParams,
} from "@tanstack/solid-router";
import ChevronsUpDown from "lucide-solid/icons/chevrons-up-down";
import Slash from "lucide-solid/icons/slash";
import { For, Show } from "solid-js";

const routeApi = getRouteApi("/(host)/host");

export default function HostNavbar() {
  const ctx = routeApi.useRouteContext();
  const params = useParams({ strict: false })();

  const selectedOrg = () => {
    return ctx().orgs.find((org) => org.slug === params.org);
  };

  const selectedCall = () => {
    return selectedOrg()?.calls.find((call) => call.slug === params.call);
  };

  return (
    <div class="border-b">
      <header class="flex justify-between px-6 mb-2">
        <div class="flex space-x-1 py-2 text-sm items-center">
          {/* Breadcrumbs */}
          <Show when={ctx().orgs.length > 0} fallback={<div>Create org</div>}>
            <Show when={selectedOrg()}>
              {(currOrg) => (
                <>
                  <Link
                    class={cn({
                      "hidden md:block": Boolean(selectedCall()),
                    })}
                    to="/host/orgs/$org"
                    params={{ org: currOrg().slug }}
                  >
                    {currOrg().name}
                  </Link>
                  <DropdownSwitcher
                    menuLabel="My Organizations"
                    options={ctx().orgs.map((org) => ({
                      to: "/host/orgs/$org",
                      params: { org: org.slug },
                      label: org.name,
                    }))}
                  />
                  <Show when={selectedCall()}>
                    {(currCall) => (
                      <>
                        <div class="px-2 md:px-4 text-muted-foreground/50">
                          <Slash size={20} strokeWidth={1} />
                        </div>
                        <Link
                          to="/host/orgs/$org/calls/$call"
                          params={{
                            org: currOrg().slug,
                            call: currCall().slug,
                          }}
                        >
                          {currCall().name}
                        </Link>
                        <DropdownSwitcher
                          menuLabel="Calls"
                          options={currOrg().calls.map((call) => ({
                            to: "/host/orgs/$org/calls/$call/dashboard",
                            params: { org: currOrg().slug, call: call.slug },
                            label: call.name,
                          }))}
                        />
                      </>
                    )}
                  </Show>
                </>
              )}
            </Show>
          </Show>
        </div>
        {/* Right side menu */}
        <div class="flex">
          <div>Feedback</div>
          <div>Profile</div>
        </div>
      </header>
      <Show when={selectedOrg()}>
        {(currOrg) => (
          <nav class="flex px-6 space-x-1">
            <Show
              when={selectedCall()}
              fallback={
                // Org Menu
                <NavigationMenu
                  links={[
                    {
                      label: "Calls",
                      from: "/host/orgs/$org",
                      to: "/host/orgs/$org/calls",
                      params: { org: currOrg().slug },
                    },
                    {
                      label: "Members",
                      to: "/host/orgs/$org/members",
                      params: { org: currOrg().slug },
                    },
                  ]}
                />
              }
            >
              {(call) => (
                // Call Menu
                <NavigationMenu
                  links={[
                    {
                      label: "Dashboard",
                      to: "/host/orgs/$org/calls/$call/dashboard",
                      params: {
                        org: currOrg().slug,
                        call: call().slug,
                      },
                    },
                    {
                      label: "Configure",
                      to: "/host/orgs/$org/calls/$call/configure",
                      params: {
                        org: currOrg().slug,
                        call: call().slug,
                      },
                    },
                  ]}
                />
              )}
            </Show>
          </nav>
        )}
      </Show>
    </div>
  );
}

export { HostNavbar };

function NavigationMenu(props: {
  links: (LinkComponentProps & { label: string })[];
}) {
  const { links } = props;
  return (
    <For each={links}>
      {(link) => (
        <MatchRoute to={link.to} params={link.params}>
          {(match) => (
            <div
              class={cn({
                "pb-2": true,
                "border-b-2 border-foreground": !!match,
              })}
            >
              <Button
                variant="ghost"
                as={(
                  props: PolymorphicCallbackProps<
                    LinkComponent<"a", string>,
                    ButtonRootOptions,
                    ButtonProps<"a">
                  >,
                ) => (
                  <Link
                    {...link}
                    {...props}
                    activeProps={{ class: "bg-accent dark:bg-accent/50" }}
                  />
                )}
              >
                {link.label}
              </Button>
            </div>
          )}
        </MatchRoute>
      )}
    </For>
  );
}

function DropdownSwitcher(props: {
  menuLabel?: string;
  options: (LinkComponentProps & { label: string })[];
}) {
  const { options, menuLabel } = props;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger class="hover:bg-accent dark:hover:bg-accent/50 text-muted-foreground/50 px-1 py-2">
        <ChevronsUpDown size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Show when={menuLabel}>
          <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
          <DropdownMenuSeparator />
        </Show>
        <For each={options}>
          {(option) => (
            <DropdownMenuItem>
              <Link {...option}>{option.label}</Link>
            </DropdownMenuItem>
          )}
        </For>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
