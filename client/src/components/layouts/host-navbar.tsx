import { useIsMobile } from "@client/lib/utils";
import {
	getRouteApi,
	Link,
	type LinkComponentProps,
	useParams,
} from "@tanstack/solid-router";
import ChevronsUpDown from "lucide-solid/icons/chevrons-up-down";
import {
	type Component,
	type ComponentProps,
	createContext,
	createSignal,
	For,
	type JSX,
	mergeProps,
	type ParentComponent,
	Show,
	splitProps,
	useContext,
} from "solid-js";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

// type HostNavbarContext = {
// 	menu: "org" | "call";
//   params: {
//     org: string;
//     call: string;
//   }
// };

// const HostNavbarContext = createContext<HostNavbarContext>({
// 	menu: "org",
//   params: {
//     org: "",
//     call: "",
//   },
// });

// function useHostNavbar() {
// 	const context = useContext(HostNavbarContext);
// 	if (!context) {
// 		throw new Error("useHostNavbar must be used within a HostNavbarProvider");
// 	}
// 	return context;
// }

// type HostNavbarProviderProps = Omit<ComponentProps<"div">, "style"> &
// 	HostNavbarContext;

// const HostNavbarProvider: Component<HostNavbarProviderProps> = (rawProps) => {
// 	const props = mergeProps(rawProps);
// 	const [local, others] = splitProps(props, ["class", "children"]);

// 	return (
// 		<HostNavbarContext.Provider value={{}}>
// 			{local.children}
// 		</HostNavbarContext.Provider>
// 	);
// };

const routeApi = getRouteApi("/(host)/host");

export default function HostNavbar() {
	const ctx = routeApi.useRouteContext();
	const params = useParams({ strict: false });

	const selectedOrg = () => {
		return ctx().orgs.find((org) => org.slug === params().org);
	};

	const selectedCall = () => {
		return selectedOrg()?.calls.find((call) => call.slug === params().call);
	};

	return (
		<div class="border-b">
			<header class="flex justify-between">
				<div class="flex">
					{/* Breadcrumbs */}
					<Show when={ctx().orgs.length > 0} fallback={<div>Create org</div>}>
						<Show when={selectedOrg()}>
							{(currOrg) => (
								<>
									<Link to="/host/orgs/$org" params={{ org: currOrg().slug }}>
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
														to: "/host/orgs/$org/calls/$call",
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
					<nav>
						<Show
							when={selectedCall()}
							fallback={
								// Org Menu
								<NavigationMenu
									links={[
										{
											label: "Calls",
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
		<ul class="flex space-x-2">
			<For each={links}>
				{(link) => (
					<li>
						<Link {...link}>{link.label}</Link>
					</li>
				)}
			</For>
		</ul>
	);
}

function DropdownSwitcher(props: {
	menuLabel?: string;
	options: (LinkComponentProps & { label: string })[];
}) {
	const { options, menuLabel } = props;
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
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
