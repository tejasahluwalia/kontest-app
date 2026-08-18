import {
	ColorModeProvider,
	ColorModeScript,
	createLocalStorageManager,
} from "@kobalte/core/color-mode";
import type { QueryClient } from "@tanstack/solid-query";
import {
	createRootRouteWithContext,
	type ErrorComponentProps,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/solid-router";
import { Toaster } from "~/components/ui/toast";
import type { authClient } from "~/lib/auth-client";
import "~/styles.css";

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
	shellComponent: RootDocument,
	errorComponent: ErrorComponent,
});

function RootDocument() {
	const storageManager = createLocalStorageManager("vite-ui-theme");
	return (
		<html lang="en">
			<head>
				<HeadContent />
				<ColorModeScript storageType={storageManager.type} />
			</head>
			<body>
				<ColorModeProvider storageManager={storageManager}>
					<Outlet />
					<Toaster />
				</ColorModeProvider>
				<Scripts />
			</body>
		</html>
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
