import { render } from "solid-js/web";
import { RouterProvider, createRouter } from "@tanstack/solid-router";
import { routeTree } from "./routeTree.gen";
import "./styles.css";
import { authClient } from "./lib/auth-client";
import { router } from "./router";
import { TanStackRouterDevtools } from '@tanstack/solid-router-devtools'

// Register things for typesafety
declare module "@tanstack/solid-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app");

if (rootElement && !rootElement.innerHTML) {
  render(() => (
    <>
      <RouterProvider router={router} />
      {/* <TanStackRouterDevtools router={router} /> */}
    </>
  ), rootElement);
}
