import {
	ColorModeProvider,
	createLocalStorageManager,
} from "@kobalte/core/color-mode";
import type { QueryClient } from "@tanstack/solid-query";
import {
	createRootRouteWithContext,
	type ErrorComponentProps,
	HeadContent,
	Outlet,
} from "@tanstack/solid-router";
import { Toaster } from "~/components/ui/toast";
import type { authClient } from "~/lib/auth-client";

interface RootContext {
	auth: typeof authClient.getSession;
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RootContext>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Kontest" },
		],
		links: [],
	}),
	component: RootComponent,
	errorComponent: ErrorComponent,
});

function RootComponent() {
	const storageManager = createLocalStorageManager("vite-ui-theme");
	return (
		<ColorModeProvider storageManager={storageManager}>
			<HeadContent />
			<Outlet />
			<Toaster />
		</ColorModeProvider>
	);
}

function ErrorComponent({ error }: ErrorComponentProps) {
	return (
		<div class="p-6">
			<h1 class="text-xl font-bold text-destructive">Error</h1>
			<p class="text-sm text-muted-foreground">An error occurred.</p>
			<p class="mt-2 text-sm">{error.message}</p>
		</div>
	);
}
