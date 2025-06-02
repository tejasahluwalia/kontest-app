import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/host/orgs/$org/members')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/host/$org/member"!</div>
}
