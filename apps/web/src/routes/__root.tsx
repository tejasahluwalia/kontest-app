import type { authClient } from "~/lib/auth-client";
import {
	ColorModeProvider,
	ColorModeScript,
	createLocalStorageManager,
} from "@kobalte/core";
import {
	createRootRouteWithContext,
	type ErrorComponentProps,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/solid-router";
import { Toaster } from "~/components/ui/toast";

interface RootContext {
	auth: typeof authClient.getSession;
}

export const Route = createRootRouteWithContext<RootContext>()({
	head: () => ({
		meta: [
			{
				title: "OpenCall",
			},
		],
	}),
	component: Root,
	errorComponent: ErrorComponent,
});

function Root() {
	const storageManager = createLocalStorageManager("vite-ui-theme");
	return (
		<>
			<HeadContent />
			<ColorModeScript storageType={storageManager.type} />
			<ColorModeProvider storageManager={storageManager}>
				<Outlet />
				<Toaster />
			</ColorModeProvider>
			<Scripts />
			{/* <TanStackRouterDevtools /> */}
		</>
	);
}

function ErrorComponent({ error }: ErrorComponentProps) {
	return (
		<div>
			<h1>Error</h1>
			<p>An error occurred.</p>
			<p>{error.message}</p>
		</div>
	);
}
