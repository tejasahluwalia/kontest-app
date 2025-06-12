import { render } from "solid-js/web";
import { RouterProvider } from "@tanstack/solid-router";
import "./styles.css";
import { router } from "./router";

// Register things for typesafety
declare module "@tanstack/solid-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("app");

if (rootElement && !rootElement.innerHTML) {
	render(() => <RouterProvider router={router} />, rootElement);
}
