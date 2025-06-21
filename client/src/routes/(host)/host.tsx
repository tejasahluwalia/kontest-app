import HostNavbar from "@client/components/layouts/host-navbar";
import server from "@client/lib/server-api";
import { Outlet, redirect } from "@tanstack/solid-router";
import { Show } from "solid-js";

export const Route = createFileRoute({
  component: RouteComponent,
  beforeLoad: async ({ context: { auth } }) => {
    const authData = await auth();
    if (!authData) {
      throw redirect({
        to: "/login",
      });
    }

    const { data, error, status } = await server.api.host.orgs.get();
    if (!data) {
      console.log(error);
      throw new Error(`Failed to fetch organizations: ${status}`);
    }
    return {
      auth: authData,
      orgs: data,
    };
  },
  loader: async ({ context: { orgs } }) => {
    return {
      orgs: orgs,
    };
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  return (
    <Show
      when={data().orgs.length > 0}
      fallback={<div>No organizations found.</div>}
    >
      <HostNavbar />
      <div class="container py-6">
        <Outlet />
      </div>
    </Show>
  );
}
