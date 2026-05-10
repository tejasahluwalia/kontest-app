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
import BuildingIcon from "lucide-solid/icons/building";
import ChevronsUpDown from "lucide-solid/icons/chevrons-up-down";
import { For, Show, useContext } from "solid-js";
import { Button, type ButtonProps } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import MemberProfilesContext from "~/context/memberProfiles";
import { cn, useIsMobile } from "~/lib/utils";
import {
	BreadcrumbList,
	Breadcrumbs,
	BreadcrumbsItem,
	BreadcrumbsLink,
	BreadcrumbsSeparator,
} from "../ui/breadcrumbs";
import Header from "./header";

export default function HostNavbar() {
	const memberProfiles = useContext(MemberProfilesContext);
	if (!memberProfiles) return null;

	const params = useParams({ strict: false });
	const isMobile = useIsMobile();

	const orgs = () => memberProfiles.map((memberProfile) => memberProfile.org);

	const selectedOrg = () => {
		return orgs().find((org) => org.slug === params().orgSlug);
	};

	const selectedCall = () => {
		return selectedOrg()?.calls.find((call) => call.slug === params().callSlug);
	};

	const selectedRound = () => {
		return selectedCall()?.rounds.find(
			(round) => round.slug === params().roundSlug,
		);
	};

	return (
		<div class="border-b">
			<Header>
				<Breadcrumbs>
					{/* Breadcrumbs */}
					<BreadcrumbList>
						<Show when={orgs().length > 0} fallback={<div>Create org</div>}>
							<Show when={selectedOrg()}>
								{(currOrg) => (
									<>
										<Show
											when={!isMobile() || (isMobile() && !selectedRound())}
										>
											<BreadcrumbsItem>
												<BreadcrumbsLink
													activeProps={{
														current: true,
													}}
													activeOptions={{
														exact: false,
													}}
													to="/host/orgs/$orgSlug"
													params={{ orgSlug: currOrg().slug }}
												>
													<Show
														when={
															!isMobile() || (isMobile() && !selectedCall())
														}
														fallback={<BuildingIcon size={16} />}
													>
														{currOrg().name}
													</Show>
												</BreadcrumbsLink>

												<DropdownSwitcher
													menuLabel="My Organizations"
													options={orgs().map((org) => ({
														to: "/host/orgs/$orgSlug",
														params: { orgSlug: org.slug },
														label: org.name,
													}))}
												/>
											</BreadcrumbsItem>
										</Show>
										<Show when={selectedCall()}>
											{(currCall) => (
												<>
													<BreadcrumbsSeparator
														classList={{
															"hidden md:block": !!selectedRound(),
														}}
													/>
													<BreadcrumbsItem>
														<BreadcrumbsLink
															activeProps={{
																current: true,
															}}
															activeOptions={{
																exact: false,
															}}
															to="/host/orgs/$orgSlug/calls/$callSlug"
															params={{
																orgSlug: currOrg().slug,
																callSlug: currCall().slug,
															}}
														>
															{currCall().name}
														</BreadcrumbsLink>
														<DropdownSwitcher
															menuLabel="Calls"
															options={currOrg().calls.map((call) => ({
																to: "/host/orgs/$orgSlug/calls/$callSlug/dashboard",
																params: {
																	orgSlug: currOrg().slug,
																	callSlug: call.slug,
																},
																label: call.name,
															}))}
														/>
													</BreadcrumbsItem>
													<Show when={selectedRound()}>
														{(currRound) => (
															<>
																<BreadcrumbsSeparator />
																<BreadcrumbsItem>
																	<BreadcrumbsLink
																		activeProps={{
																			current: true,
																		}}
																		activeOptions={{
																			exact: false,
																		}}
																		to="/host/orgs/$orgSlug/calls/$callSlug/rounds/$roundSlug/configure"
																		params={{
																			orgSlug: currOrg().slug,
																			callSlug: currCall().slug,
																			roundSlug: currRound().slug,
																		}}
																	>
																		{currRound().name}
																	</BreadcrumbsLink>
																	<DropdownSwitcher
																		menuLabel="Rounds"
																		options={currCall().rounds.map((round) => ({
																			to: "/host/orgs/$orgSlug/calls/$callSlug/rounds/$roundSlug/configure",
																			params: {
																				orgSlug: currOrg().slug,
																				callSlug: currCall().slug,
																				roundSlug: round.slug,
																			},
																			label: round.name,
																		}))}
																	/>
																</BreadcrumbsItem>
															</>
														)}
													</Show>
												</>
											)}
										</Show>
									</>
								)}
							</Show>
						</Show>
					</BreadcrumbList>
				</Breadcrumbs>
			</Header>
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
											from: "/host/orgs/$orgSlug",
											to: "/host/orgs/$orgSlug/calls",
											params: { orgSlug: currOrg().slug },
										},
										{
											label: "Members",
											to: "/host/orgs/$orgSlug/members",
											params: { orgSlug: currOrg().slug },
										},
									]}
								/>
							}
						>
							{(call) => (
								<Show
									when={selectedRound()}
									fallback={
										// Call Menu
										<NavigationMenu
											links={[
												{
													label: "Dashboard",
													to: "/host/orgs/$orgSlug/calls/$callSlug/dashboard",
													params: {
														orgSlug: currOrg().slug,
														callSlug: call().slug,
													},
												},
												{
													label: "Rounds",
													to: "/host/orgs/$orgSlug/calls/$callSlug/rounds",
													params: {
														orgSlug: currOrg().slug,
														callSlug: call().slug,
													},
												},
												{
													label: "Team",
													to: "/host/orgs/$orgSlug/calls/$callSlug/team",
													params: {
														orgSlug: currOrg().slug,
														callSlug: call().slug,
													},
												},
											]}
										/>
									}
								>
									{(round) => (
										// Round Menu
										<NavigationMenu
											links={[
												{
													label: "Judging",
													to: "/host/orgs/$orgSlug/calls/$callSlug/rounds/$roundSlug/judging",
													params: {
														orgSlug: currOrg().slug,
														callSlug: call().slug,
														roundSlug: round().slug,
													},
												},
												{
													label: "Configure",
													to: "/host/orgs/$orgSlug/calls/$callSlug/rounds/$roundSlug/configure",
													params: {
														orgSlug: currOrg().slug,
														callSlug: call().slug,
														roundSlug: round().slug,
													},
												},
											]}
										/>
									)}
								</Show>
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
