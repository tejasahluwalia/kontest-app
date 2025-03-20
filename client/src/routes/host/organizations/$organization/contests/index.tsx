import { createFileRoute, Link, useRouter } from "@tanstack/solid-router";
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
import { Card, CardContent, CardHeader } from "@client/components/ui/card";
import Trash2 from "lucide-solid/icons/trash-2";

export const Route = createFileRoute(
  "/host/organizations/$organization/contests/",
)({
  component: RouteComponent,
  loader: async ({ context: { organization } }) => {
    return { organization };
  },
});

function RouteComponent() {
  const { organization } = Route.useLoaderData()();
  const contests = organization.contests;

  const router = useRouter();

  const [dialogOpen, setDialogOpen] = createSignal(false);

  const handleCreateSuccess = () => {
    setDialogOpen(false);
  };

  const deleteContest = ({ slug, id }: { slug: string, id: string }) => {
    server.api.organizations({ organizationSlug: organization.slug }).contests({ contestSlug: slug }).index.delete({}, {
      query: {
        organizationId: organization.id,
        contestId: id,
      },
    });
    router.invalidate();
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

      <Show when={organization}>
        <Show
          when={contests.length > 0}
          fallback={
            <div class="text-center py-12">
              <h3 class="text-lg font-medium">No contests found</h3>
              <p class="text-gray-500 dark:text-gray-400 mt-2">
                {contests.length
                  ? "Try a different search term"
                  : "Create your first contest to get started"}
              </p>
            </div>
          }
        >
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <For each={contests}>
              {(contest) => {
                const numberOfSubmissions = contest.submissions?.length || 0;
                const numberOfParticipants = contest.contestToParticipant?.length || 0;
                const { slug, name, id } = contest;
                return (
                  <div>
                    <Link
                      from="/host/organizations/$organization/contests"
                      to="/host/organizations/$organization/contests/$contest/dashboard"
                      params={{
                        organization: organization.slug,
                        contest: slug,
                      }}
                      class="block"
                    >
                      <Card>
                        <CardHeader class="flex items-center justify-between">
                          <h3 class="text-xl font-semibold mb-2">{name}</h3>
                        </CardHeader>
                        <CardContent>
                          <div class="flex items-center justify-between">
                            <span class="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                              {numberOfSubmissions} submissions
                            </span>
                            <span class="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                              {numberOfParticipants} participants
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteContest({ slug, id })}
                    >
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </div>
                )
              }}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  );
}
