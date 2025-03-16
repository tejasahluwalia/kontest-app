import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/host/organizations/$organization/members')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/host/$organization/member"!</div>
}
