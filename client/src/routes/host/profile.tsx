import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/host/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/host/organizations/profile"!</div>
}
