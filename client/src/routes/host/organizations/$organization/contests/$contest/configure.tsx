import { createFileRoute, notFound } from '@tanstack/solid-router'
import { FormBuilder } from '~/components/form-builder'
import type { FormSchema } from '~/components/form-builder/primitives/form'

export const Route = createFileRoute(
  '/host/organizations/$organization/contests/$contest/configure',
)({
  component: RouteComponent,
  loader: async ({ params, context: { organization, contest } }) => {
    if (!contest.schema) {
      throw notFound();
    }
    return { contest };
  }
})

function RouteComponent() {
  const {contest} = Route.useLoaderData()();
  const initialSchema = contest.schema as FormSchema;

  return (
    <div class="container py-6 max-w-7xl">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Configure {contest.name} Form</h1>
      </div>

      <div>
        <FormBuilder
          initialSchema={initialSchema}
        />
      </div>
    </div>
  )
}
