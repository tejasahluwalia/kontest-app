import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/host/organizations/$organization')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/host/$organisation"!</div>
}
