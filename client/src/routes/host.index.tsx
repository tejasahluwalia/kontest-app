import { createFileRoute, Navigate, redirect } from '@tanstack/solid-router'
import { authClient } from "~/lib/auth-client";

export const Route = createFileRoute('/host/')({
  beforeLoad: async ({context, location}) => {
    // console.log(context.auth())
    // if (!context.auth().data?.user) {
    //   throw redirect({
    //     to: '/host/login',
    //     search: {
    //       redirect: location.href,
    //     }
    //   })
    // }
  },

  component: RouteComponent,
})

function RouteComponent() {
  const loaderData = Route.useLoaderData()

  return (
    <div>
      <pre>{JSON.stringify(loaderData(), null, 2)}</pre>
    </div>
  )
}
