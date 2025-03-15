import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/host/contests/$contest/entries')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/host/contests/$contest/entries"!</div>
}
