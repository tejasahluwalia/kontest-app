---
title: Architecture Overview
description: In-depth technical architecture of the Kontest monorepo, covering SolidJS frontend, ElysiaJS server, Drizzle ORM, and Bun static generation.
section: Architecture
order: 3
badge: Core
slug: architecture
---

# Architecture Overview

Kontest is structured as an integrated, type-safe monorepo. Every layer—from database schema definitions to frontend UI controls—shares TypeScript definitions with zero code duplication.

---

## High-Level Architecture Diagram

```
+-------------------------------------------------------------+
|                     Bun Workspace Root                      |
+-------------------------------------------------------------+
         |                        |                   |
         v                        v                   v
+------------------+    +-------------------+    +------------------+
|  apps/client     |    |  apps/server      |    |  apps/docs       |
|  (SolidJS 2 +    |    |  (ElysiaJS +      |    |  (Bun + JSX +    |
|   Tailwind CSS)  |    |   BetterAuth)     |    |   Markdown SSG)  |
+------------------+    +-------------------+    +------------------+
         |                        |                   |
         |  (Type imports)        |  (ORM queries)    | (Builds static)
         +----------->  packages/db  <----------------+
                        (Drizzle ORM +
                         PostgreSQL Schema)
```

---

## 1. Client (`apps/client`)

The frontend application is built with **SolidJS 2**, utilizing fine-grained reactive primitives and signals without a virtual DOM overhead.

- **Routing**: TanStack Solid Router / SolidJS 2 Router (`@solidjs/router`).
- **UI System**: Kobalte UI primitives (`@kobalte/core`) with Tailwind CSS styling and class-variance-authority (`cva`).
- **State & Data Fetching**: TanStack Solid Query (`@tanstack/solid-query`) integrated with Eden Treaty RPC client.
- **Form Management**: Formisch Solid (`@formisch/solid`) with Valibot type validation.

---

## 2. Server (`apps/server`)

The backend is built with **ElysiaJS**, a fast web framework for Bun featuring end-to-end type safety, plugin-based architecture, and standard web APIs.

```ts
import { cors } from "@elysia/cors";
import { Elysia } from "elysia";
import { hostPlugin } from "./plugins/host";
import { jurorPlugin } from "./plugins/juror";
import { publicPlugin } from "./plugins/public";
import { userPlugin } from "./plugins/user";

export const app = new Elysia()
  .use(cors())
  .group("/api", (api) =>
    api
      .use(publicPlugin)
      .use(userPlugin)
      .use(hostPlugin)
      .use(jurorPlugin)
  );

export type App = typeof app;
```

### Key Server Plugins:
- **`hostPlugin`**: Manages Organizations, Calls for Submissions, Rounds, Judging Configurations, and Member Invitations.
- **`jurorPlugin`**: Manages judge assignments, rubric scoring, and evaluation submissions.
- **`userPlugin`**: User profile queries and settings.
- **`publicPlugin`**: Public call directory, organization discovery, and submission intake.
- **`betterAuth`**: Secure session cookies, email OTP authentication, and account linking.

---

## 3. Database (`packages/db`)

All database models and schema definitions live in `packages/db`, using **Drizzle ORM**:

- **Declarative Schema**: Tables defined in TypeScript with PostgreSQL column types (`jsonb`, `text`, `timestamp`, `pgEnum`).
- **TypeBox Validation**: Automatic conversion of Drizzle schemas to TypeBox models for Elysia runtime validation via `drizzle-typebox`.
- **Zero-Duplication Type Sharing**: Client routes import types directly from `@kontest/db` for strict type safety.

---

## 4. Docs & Marketing (`apps/docs`)

A custom-built static site generator written specifically for **Bun**:

- **Pure JSX**: Templates and components written in standard TSX without React runtime dependencies.
- **Markdown Pipeline**: Built-in parser supporting frontmatter, syntax-highlighted code blocks, alerts, and tables.
- **Zero Hydration JS**: Generates pure, semantic HTML and CSS for instant load times and SEO optimization.
