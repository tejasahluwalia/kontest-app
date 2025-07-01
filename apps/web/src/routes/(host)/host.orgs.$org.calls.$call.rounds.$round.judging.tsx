export const Route = createFileRoute({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/(host)/host/orgs/$org/calls/$call/rounds/$round/judging"!</div>
  )
}
