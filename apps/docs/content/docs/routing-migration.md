---
title: SolidJS 2 Router Migration Guide
description: Step-by-step roadmap for migrating from TanStack Router to the new official SolidJS 2 Router.
section: Guides & Migration
order: 4
badge: Migration
slug: routing-migration
---

# SolidJS 2 Router Migration Guide

This guide outlines the process of migrating `@kontest/client` from **TanStack Solid Router** to the new official **SolidJS 2 Router** (`@solidjs/router`).

> [!NOTE]
> Refer to the official [SolidJS 2 Routing Documentation](https://v2.solidjs.com/routing/overview) for upstream architectural specifications and API contracts.

---

## Key Conceptual Differences

| Feature | TanStack Router | SolidJS 2 Router (`@solidjs/router`) |
| :--- | :--- | :--- |
| **Package** | `@tanstack/solid-router` | `@solidjs/router` |
| **Root Setup** | `createRouter({ routeTree })` | `<Router root={RootLayout}>{routes}</Router>` |
| **Nested Outlets** | `<Outlet />` from TanStack | `props.children` or `<Route path="..." component={...}>` |
| **Data Fetching** | `loader: async () => ...` | `cache()` + `createAsync()` primitives |
| **Route Definitions** | `createFileRoute(...)` | `Route` JSX components or nested route objects |
| **Navigation** | `useNavigate()`, `<Link to="...">` | `useNavigate()`, `<A href="...">` |

---

## 1. Package Installation

Update `apps/client/package.json` dependencies:

```bash
# In apps/client
pnpm add @solidjs/router@latest
pnpm remove @tanstack/solid-router @tanstack/solid-start
```

---

## 2. Root Entry Point Migration

### Old Setup (TanStack Router)
```tsx
// apps/client/src/main.tsx
import { RouterProvider } from "@tanstack/solid-router";
import { router } from "./router";

render(() => <RouterProvider router={router} />, rootElement);
```

### New Setup (SolidJS 2 Router)
```tsx
// apps/client/src/main.tsx
import { Router, Route } from "@solidjs/router";
import { render } from "@solidjs/web";
import { QueryClientProvider } from "@tanstack/solid-query";
import { queryClient } from "./lib/query";
import { RootLayout } from "./components/layouts/RootLayout";
import { routes } from "./routes";

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <Router root={RootLayout}>
        {routes}
      </Router>
    </QueryClientProvider>
  ),
  document.getElementById("app")!
);
```

---

## 3. Route Component & Nested Layouts

In SolidJS 2 Router, layouts receive child routes directly as `props.children`:

```tsx
// apps/client/src/components/layouts/RootLayout.tsx
import { type RouteSectionProps } from "@solidjs/router";
import { ColorModeProvider } from "@kobalte/core/color-mode";
import { Toaster } from "~/components/ui/toast";

export function RootLayout(props: RouteSectionProps) {
  return (
    <ColorModeProvider>
      <main class="min-h-screen bg-background text-foreground">
        {props.children}
      </main>
      <Toaster />
    </ColorModeProvider>
  );
}
```

---

## 4. Data Loading with `cache()` and `createAsync()`

SolidJS 2 Router provides first-class reactive data loading through `cache` and `createAsync`:

```tsx
// apps/client/src/routes/host/orgs.tsx
import { cache, createAsync } from "@solidjs/router";
import { For, Show, Suspense } from "solid-js";
import server from "~/lib/server-api";

// Cached data loader
const getOrgs = cache(async () => {
  const { data, error } = await server.api.host.index.get();
  if (error) throw error;
  return data;
}, "host-orgs");

export const route = {
  load: () => getOrgs(),
};

export default function OrgsPage() {
  const orgs = createAsync(() => getOrgs());

  return (
    <Suspense fallback={<div>Loading organizations...</div>}>
      <For each={orgs()}>
        {(org) => (
          <div class="card p-4 border rounded-lg">
            <h3>{org.name}</h3>
            <p>{org.slug}</p>
          </div>
        )}
      </For>
    </Suspense>
  );
}
```

---

## 5. Migration Checklist

- [ ] Update dependencies in `apps/client/package.json` to include `@solidjs/router`.
- [ ] Replace `createFileRoute` in route files with standard Solid components.
- [ ] Migrate `<Link to="...">` components to `<A href="...">`.
- [ ] Convert TanStack loader functions to `cache()` and `createAsync()`.
- [ ] Remove `tsr.config.json` and generated `routeTree.gen.ts` once migration is complete.
