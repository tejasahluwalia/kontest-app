---
title: Getting Started
description: Quickstart guide to clone, install dependencies, configure environment variables, and run Kontest locally.
section: Overview
order: 2
badge: Quickstart
slug: getting-started
---

# Getting Started with Kontest

Follow this guide to get the complete Kontest monorepo running on your local development machine.

---

## Prerequisites

Before starting, ensure you have the following installed on your machine:

- **Node.js**: `v20+` or `v22+`
- **Bun**: `v1.2+` (High-performance JavaScript runtime & package manager)
- **Docker**: For running PostgreSQL database container

---

## 1. Clone & Install Dependencies

Clone the repository and install all workspace dependencies using `bun`:

```bash
# Clone the repository
git clone https://github.com/kontest/kontest-app.git
cd kontest-app

# Install all workspace packages
bun install
```

> [!TIP]
> Bun automatically links workspace packages such as `@kontest/db` across `@kontest/client` and `@kontest/server` with zero build-step overhead during local development.

---

## 2. Configure Environment Variables

Sync the sample `.env.example` file to `.env`:

```bash
bun env:sync
# or: cp .env.example .env
```

Validate that your environment configuration passes all Valibot schemas across `@kontest/db`, `@kontest/server`, `@kontest/client`, and `@kontest/docs`:

```bash
bun env:check
```

Ensure your `.env` contains the required keys:

```env
NODE_ENV=development

# Database & PostgreSQL components (DATABASE_URL is constructed automatically)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=postgres

# Backend server & BetterAuth
PORT=3000
SERVER_URL=http://localhost:3000
AUTH_URL=http://localhost:3000
AUTH_SECRET=kontest_dev_super_secret_key_1234567890

# Client base URLs (Vite)
VITE_SERVER_URL=http://localhost:3000
VITE_AUTH_URL=http://localhost:3000

# Documentation site
DOCS_PORT=4000
```

---

## 3. Start Database Container

Start the PostgreSQL instance defined in Docker Compose:

```bash
# Start PostgreSQL container in background
bun db:up
```

To run database migrations or push schema changes directly:

```bash
# Push schema changes to database
bun db:push

# Open Drizzle Studio in browser
bun db:studio
```

---

## 4. Run Development Servers

You can launch all applications in parallel or run individual components independently:

### Run Everything Together
```bash
bun dev
```

### Run Individual Components
```bash
# Launch SolidJS Client (http://localhost:5173)
bun dev:client

# Launch ElysiaJS Backend Server (http://localhost:3000)
bun dev:server

# Launch Marketing & Docs Static Site (http://localhost:4000)
bun dev:docs
```

---

## Available NPM Scripts

| Command | Action |
| :--- | :--- |
| `bun dev` | Starts all apps in parallel |
| `bun dev:client` | Starts Vite dev server for `@kontest/client` |
| `bun dev:server` | Starts Bun watch server for `@kontest/server` |
| `bun dev:docs` | Starts Bun dev server for `@kontest/docs` |
| `bun build` | Builds all packages across workspace |
| `bun build:docs` | Generates static HTML & CSS files in `apps/docs/dist` |
| `bun lint` | Runs Biome linter across monorepo |
| `bun typecheck` | Validates TypeScript types across all packages |
| `bun db:up` | Boots Postgres Docker container |
| `bun db:down` | Stops Postgres Docker container |
