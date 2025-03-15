import { createFileRoute } from '@tanstack/solid-router'


export const Route = createFileRoute('/host/organizations/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/host/organizations/$organization"!</div>
}
