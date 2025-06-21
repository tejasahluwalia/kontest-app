import { HeadContent, Outlet, Scripts } from "@tanstack/solid-router";
import {
  ColorModeProvider,
  ColorModeScript,
  createLocalStorageManager,
} from "@kobalte/core";
import {
  createRootRouteWithContext,
  type ErrorComponentProps,
} from "@tanstack/solid-router";
import type { authClient } from "@client/lib/auth-client";
import { Toaster } from "~/components/ui/toast";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";

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
