import UserAuthForm from '@client/components/userAuthForm'
import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div class="flex h-screen w-screen items-center justify-center"><UserAuthForm /></div>
}
