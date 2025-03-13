import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/host/$organisation')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/host/$organisation"!</div>
}
