import { createFileRoute, Link } from "@tanstack/solid-router";
import { Show, For, createSignal } from "solid-js";
import server from "@client/lib/server-api";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import CreateContestForm from "~/components/forms/create-contest-form";

export const Route = createFileRoute('/host/organizations/$organization/contests')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { data, error, status } = await server.api.organizations({ organizationSlug: params.organization }).index.get();
    if (error) {
      throw error.value;
    }
    if (status !== 200) {
      throw new Error(`Failed to fetch organization: ${status}`);
    }
    return data;
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const organization = data();
  const contests = organization?.contests || [];

  const [dialogOpen, setDialogOpen] = createSignal(false);

  const handleCreateSuccess = () => {
    setDialogOpen(false);
  };

  return (
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold">Contests</h1>
        <Dialog open={dialogOpen()} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button>Create Contest</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new contest</DialogTitle>
            </DialogHeader>
            <CreateContestForm 
              organizationId={organization.id} 
              organizationSlug={organization.slug} 
              onSuccess={handleCreateSuccess} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Show
        when={organization}
        fallback={
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map(() => (
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        }
      >
        <Show
          when={contests.length > 0}
          fallback={
            <div class="text-center py-12">
              <h3 class="text-lg font-medium">No contests found</h3>
              <p class="text-gray-500 dark:text-gray-400 mt-2">
                {contests.length ? "Try a different search term" : "Create your first contest to get started"}
              </p>
            </div>
          }
        >
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <For each={contests}>
              {(contest) => (
                <Link
                  to="/host/contests/$contest"
                  params={{ contest: contest.slug }}
                  class="block"
                >
                  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                    <h3 class="text-xl font-semibold mb-2">{contest.name}</h3>
                    <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {new Date(contest.createdAt).toLocaleDateString()}
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                        {(contest as any).submissions?.length || 0} submissions
                      </span>
                      <span class="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                        {(contest as any).contestToParticipant?.length || 0} participants
                      </span>
                    </div>
                  </div>
                </Link>
              )}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  );
}
