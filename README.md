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
│   ├── env/             # Type-Safe Valibot Schemas, Runtime Invariant Checks & CLI Syncer
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
| **`@kontest/env`** | `packages/env` | Valibot, TypeScript | Unified type-safe environment schemas, runtime validators & CLI syncer. |
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

### 3. Start Database & Seed (PostgreSQL)
```bash
# Start PostgreSQL, push schema, and seed demo fixtures
bun db:setup

# Or run steps individually:
bun db:up     # Start PostgreSQL container
bun db:push   # Push schema to database
bun db:seed   # Seed demo users, orgs, calls, rounds, submissions
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

### 5. Instant Agent Auth & Testing
```bash
# Authenticate programmatically as demo host without manual OTP copying
bun dev:auth host@kontest.dev

# Run full-stack 16-point smoke test suite
bun test:smoke

# Run fast unit & integration tests
bun test
```

---

## Workspace Commands

| Command | Action |
| :--- | :--- |
| `bun dev` | Runs client, server, and docs concurrently |
| `bun dev:auth [email]` | Generates valid BetterAuth session token & cookie for any test user |
| `bun test` | Runs unit and integration test suite across packages |
| `bun test:smoke` | Runs end-to-end full stack smoke test suite |
| `bun test:browser` | Headless Chromium Playwright test + screenshots + console check |
| `bun test:cdp` | Native Chrome DevTools Protocol (CDP) direct session test |
| `bun env:check` | Validates all environment variables against Valibot schemas |
| `bun env:sync` | Syncs `.env.example` template into `.env` for local development |
| `bun db:setup` | Starts Docker DB container, pushes schema, and seeds demo data |
| `bun db:reset` | Fully tears down DB, re-creates schema, and re-seeds fixtures |
| `bun db:studio` | Opens Drizzle Studio GUI for PostgreSQL |
| `bun run build` | Builds all packages across the workspace for production |
| `bun lint` | Runs Biome code formatter and linter with auto-fixes |
| `bun typecheck` | Validates TypeScript types across the entire monorepo |
| `bun check:all` | Runs full CI validation pipeline (typecheck + lint + build) |

---

## Autonomous Agent & Swarm Development

For detailed architecture diagrams, seed account specifications, Eden Treaty patterns, and swarm workflow guidelines, refer to **[`AGENTS.md`](./AGENTS.md)**.

---

## Documentation

Comprehensive guides are available in `apps/docs` and rendered statically:
- **[Introduction](/docs/introduction.html)**
- **[Getting Started](/docs/getting-started.html)**
- **[Architecture Overview](/docs/architecture.html)**
- **[SolidJS 2 Router Migration Guide](/docs/routing-migration.html)**
- **[Server API & Eden Treaty](/docs/server-api.html)**
- **[Database Schema](/docs/database-schema.html)**
