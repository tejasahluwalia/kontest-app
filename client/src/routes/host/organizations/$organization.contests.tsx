import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/host/organizations/$organization/contests')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/host/$organization/contests"!</div>
}
