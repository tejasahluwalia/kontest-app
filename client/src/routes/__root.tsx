import { createRootRoute, Link, Outlet } from '@tanstack/solid-router'

export const Route = createRootRoute({
  component: () => (
    <div>
      <div class="p-2 flex gap-2">
        <Link to="/" class="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" class="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
    </div>
  ),
})