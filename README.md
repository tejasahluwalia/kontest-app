# Kontest Monorepo

A submissions acceptance, management, and judging platform for open calls, grants, hackathons, competitions, and awards.

This repository is structured as a modular monorepo managed and powered by **Bun**, **SolidJS 2**, **ElysiaJS**, and **Drizzle ORM**.

---

## Workspace Structure

```
kontest-app/
├── apps/
│   ├── client/          # SolidJS 2 Single-Page Application (TanStack Router / Solid 2 Router)
│   ├── server/          # ElysiaJS Backend API (BetterAuth, Plugins, Typed RPC)
│   └── docs/            # Marketing & Documentation Website (Statically rendered with Bun + JSX + Markdown)
├── packages/
│   └── db/              # PostgreSQL Drizzle ORM Schema, TypeBox Models & Docker Compose
├── package.json         # Workspace definition, Bun Catalogs & scripts
└── biome.json           # Shared Biome formatting and linting configuration
```

---

## Packages & Components

| Package | Directory | Tech Stack | Description |
| :--- | :--- | :--- | :--- |
| **`@kontest/client`** | `apps/client` | SolidJS 2, Vite, Tailwind CSS, Kobalte UI | Interactive frontend app for hosts, jurors, and applicants. |
| **`@kontest/server`** | `apps/server` | ElysiaJS 2, Bun, BetterAuth | REST/RPC backend with plugin-based architecture and session handling. |
| **`@kontest/docs`** | `apps/docs` | Bun, Pure JSX, Custom Markdown SSG | High-performance static marketing landing page & documentation. |
| **`@kontest/db`** | `packages/db` | Drizzle ORM, PostgreSQL, Docker | Centralized database schema, migration scripts, and TypeBox query models. |

---

## Quickstart

### 1. Install Dependencies
```bash
bun install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Start Database (PostgreSQL)
```bash
# Start PostgreSQL via Docker Compose
bun db:up

# Push schema to database
bun db:push
```

### 4. Run Development Servers
```bash
# Run all apps concurrently
bun dev

# Or run individual apps:
bun dev:client   # SolidJS App on http://localhost:5173
bun dev:server   # ElysiaJS Server on http://localhost:3000
bun dev:docs     # Marketing & Docs on http://localhost:4000
```

---

## Build Commands

| Command | Action |
| :--- | :--- |
| `bun build` | Builds all packages across the workspace |
| `bun build:client` | Builds SolidJS client bundle using Vite |
| `bun build:docs` | Statically renders landing page & docs HTML using Bun SSG |
| `bun preview:docs`| Serves the generated static docs site from `apps/docs/dist` |
| `bun lint` | Runs Biome code formatter and linter |
| `bun typecheck` | Validates TypeScript types across the monorepo |

---

## Documentation

Comprehensive guides are available in `apps/docs` and rendered statically:
- **[Introduction](/docs/introduction.html)**
- **[Getting Started](/docs/getting-started.html)**
- **[Architecture Overview](/docs/architecture.html)**
- **[SolidJS 2 Router Migration Guide](/docs/routing-migration.html)**
- **[Server API & Eden Treaty](/docs/server-api.html)**
- **[Database Schema](/docs/database-schema.html)**
