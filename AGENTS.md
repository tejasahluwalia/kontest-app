# AGENTS.md — Autonomous Agent & Swarm Development Guide

> [!IMPORTANT]
> This guide is specifically written for AI coding agents and autonomous swarms working in continuous development loops on the **Kontest** platform.

---

## 1. Monorepo Map & Architecture

Kontest is a submissions acceptance, management, and judging platform built for hackathons, grants, and competitions.

```
kontest-app/
├── apps/
│   ├── client/          # SolidJS 2 + TanStack Router + Tailwind CSS 4 Single-Page Application
│   ├── server/          # ElysiaJS 2 + Bun + BetterAuth Backend API
│   └── docs/            # High-performance Static Marketing & Docs Site (Bun SSG + JSX + Markdown)
├── packages/
│   └── db/              # PostgreSQL Drizzle ORM Schema, TypeBox Models, Docker Compose & Seeder
├── scripts/
│   ├── dev-auth.ts      # Agent Auth Helper (requests OTP & generates valid session tokens)
│   └── smoke-test.ts    # End-to-End Monorepo Smoke Test & Healthcheck Suite
├── package.json         # Workspace scripts & Bun catalog dependencies
└── biome.json           # Monorepo linting & formatting rules
```

### Port & Service Allocation

| Service | Port | Local URL | Tech Stack |
| :--- | :--- | :--- | :--- |
| **Server API** | `3000` | `http://localhost:3000` | Elysia 2, Bun, BetterAuth |
| **Client Frontend** | `5173` | `http://localhost:5173` | SolidJS 2, Vite, TanStack Router |
| **Docs & Marketing** | `4000` | `http://localhost:4000` | Bun HTTP Server, Pure JSX SSG |
| **PostgreSQL** | `5432` | `postgres://user:password@localhost:5432/postgres` | PostgreSQL 18.6 Alpine (Docker) |

---

## 2. Essential Commands for Dev Loops

Always use `bun run <script>` (or `bun <script>`) from the workspace root:

```bash
# --- Setup & Database ---
bun db:up             # Start PostgreSQL container via Docker Compose
bun db:push           # Apply schema changes directly to DB via drizzle-kit push
bun db:seed           # Populate database with demo users, orgs, calls, rounds, submissions
bun db:setup          # One-step DB boot, schema push, and seed
bun db:reset          # Complete clean reset (down -> up -> push -> seed)

# --- Development Servers ---
bun dev               # Launch client, server, and docs concurrently
bun dev:server        # Start Elysia backend on port 3000 (with hot reload)
bun dev:client        # Start SolidJS frontend on port 5173 (with Vite HMR)
bun dev:docs          # Start Docs & Marketing live dev server on port 4000

# --- Agent Authentication & Testing ---
bun dev:auth          # Instantly authenticate as host@kontest.dev & print session token
bun dev:auth <email>  # Authenticate as any test user (e.g. juror@kontest.dev, alice@kontest.dev)
bun test              # Run unit & integration test suite (apps/docs, apps/server, packages/db)
bun test:smoke        # Run complete 16-point end-to-end healthcheck across all services
bun test:browser      # Run Playwright Headless Chromium SPA test + screenshots + console audit

# --- Verification & Build ---
bun typecheck         # Typecheck all packages across workspace
bun lint              # Format & fix code with Biome
bun run build         # Build client, server, and docs for production
bun check:all         # Comprehensive CI check (typecheck + lint + build)
```

> [!WARNING]
> Do NOT run `bun build` directly without `run` (i.e. use `bun run build`). Bun has a built-in `bun build <entrypoint>` CLI that conflicts with workspace npm build scripts if `run` is omitted.

---

## 3. Pre-Seeded Test Accounts

When running `bun db:seed` or `bun db:setup`, the following accounts are created:

| Role | Email | Name | Sample Capabilities |
| :--- | :--- | :--- | :--- |
| **Host Admin** | `host@kontest.dev` | Host Admin | Owns `acme-innovations` & `open-grants`, creates calls, manages rounds |
| **Chief Juror** | `juror@kontest.dev` | Chief Juror | Assigned to `Global AI Hackathon 2026` rounds, scores submissions |
| **Applicant 1** | `alice@kontest.dev` | Alice Developer | Participant in `Global AI Hackathon 2026`, submitted `NeuroFlow Agent` |
| **Applicant 2** | `bob@kontest.dev` | Bob Builder | Participant in `Global AI Hackathon 2026`, submitted `SynthGrid UI` |

---

## 4. How to Authenticate in Agent Loops

Kontest uses **BetterAuth** with email OTP authentication.

### Method A: Automated Agent CLI Helper (`scripts/dev-auth.ts`)
Run:
```bash
bun dev:auth host@kontest.dev
```
Output:
```
================ AUTHENTICATION SUCCESS ================
User ID:      usr_host_admin_01
User Name:    Host Admin
User Email:   host@kontest.dev
Session Token: <token_string>
Cookie:       better-auth.session_token=<token_string>
========================================================

Sample cURL command for agents:
curl -H "Cookie: better-auth.session_token=<token>" http://localhost:3000/api/host
```

### Method B: Programmatic HTTP OTP Exchange
1. **Request OTP**:
   ```bash
   POST /api/auth/email-otp/send-verification-otp
   Content-Type: application/json
   {"email": "host@kontest.dev", "type": "sign-in"}
   ```
2. **Retrieve OTP**:
   The OTP is logged to server stdout (`[AUTH OTP] ...`), or query `verification` table in PostgreSQL:
   ```ts
   import { db } from "@kontest/db";
   const verifications = await db.query.verification.findMany();
   const otp = verifications.find(v => v.identifier.includes("host@kontest.dev"))?.value.split(":")[0];
   ```
3. **Sign In**:
   ```bash
   POST /api/auth/sign-in/email-otp
   Content-Type: application/json
   {"email": "host@kontest.dev", "otp": "123456"}
   ```
4. **Read Session Cookie**:
   Extract `better-auth.session_token` from response `set-cookie` header.

---

## 5. Schema & Database Guidelines (`packages/db`)

- **Primary Keys**: All IDs use URL-safe nanoids generated via `nanoid()` or prefixed strings.
- **Relational Queries**: Drizzle 1.0 RC is initialized with `{ relations: schema.relations }`. Use `db.query.<table_name>.findMany({ with: { ... } })`.
- **Validation**: Schema-to-TypeBox models are generated in `packages/db/src/model.ts` using `drizzle-orm/typebox` and `spread()`.
- **Modifying Schema**:
  1. Edit `packages/db/src/schema.ts`
  2. Run `bun db:push` to apply changes to local PostgreSQL
  3. Update `packages/db/src/model.ts` if adding/modifying API body/response models
  4. Update `packages/db/src/seed.ts` if new required columns are added

---

## 6. Elysia Backend & Eden Treaty (`apps/server`)

- **Plugin Architecture**:
  - `publicPlugin` (`/api/calls`): Public calls and round discovery.
  - `userPlugin` (`/api/user`): Profile management (`PATCH /api/user/me`).
  - `hostPlugin` (`/api/host`): Organization, call, round, rubric, and member management.
  - `jurorPlugin` (`/api/juror`): Juror evaluations, criteria scoring, and judgements.
- **Guards & Macros**:
  - `mustAuth`: Enforces authenticated session; derives `user` and `session` onto context.
  - `maybeAuth`: Populates `user` and `session` if present, otherwise `null` without rejecting.
- **Eden Treaty Frontend Integration**:
  The client (`apps/client/src/lib/server-api.ts`) imports Elysia app types directly:
  ```ts
  import { treaty } from "@elysia/eden";
  import type { App } from "@kontest/server";
  export const server = treaty<App>("http://localhost:3000");
  ```

---

## 7. Swarm Parallelization Strategy

When running multi-agent swarms concurrently on different layers of the codebase:

```
┌─────────────────────────────────────────────────────────────┐
│                       SWARM ROUTING                         │
├─────────────────┬─────────────────┬─────────────────────────┤
│ Domain          │ Assigned Paths  │ Safe Parallel Tasks     │
├─────────────────┼─────────────────┼─────────────────────────┤
│ Backend API     │ apps/server/**  │ New routes, auth hooks  │
│ Database/ORM    │ packages/db/**  │ Migrations, seed data   │
│ Client Frontend │ apps/client/**  │ UI components, routes   │
│ Docs/Marketing  │ apps/docs/**    │ Markdown docs, SSG pages│
│ Test Automation │ scripts/**      │ Smoke & integration test│
└─────────────────┴─────────────────┴─────────────────────────┘
```

### Verification Loop Checklist for Every Agent Iteration:
```bash
bun test          # 1. Fast unit tests (<1s)
bun test:smoke    # 2. End-to-end smoke test (~200ms)
bun test:browser  # 3. Headless Chromium E2E + Screenshots + Console Error Check
bun test:cdp      # 4. Chrome DevTools Protocol (CDP) direct session + Performance telemetry
bun typecheck     # 5. TypeScript validation across all workspaces
bun lint          # 6. Biome formatting & lint check
```

---

## 8. Browser Automation & MCP Server Integration

### Headless Chromium Runner (`scripts/e2e-browser.ts` / `bun test:browser`)
The monorepo includes a complete Playwright runner that:
1. Boots headless Chromium.
2. Intercepts all browser `console.error`, unhandled page exceptions, and failed network calls.
3. Automatically completes the SolidJS client login flow and dashboard navigation.
4. Generates full-page visual screenshots in `artifacts/screenshots/`:
   - `01_home_page.png`
   - `02_login_page.png`
   - `03_otp_stage.png`
   - `04_host_dashboard.png`

### Native Chrome DevTools Protocol Runner (`scripts/cdp-runner.ts` / `bun test:cdp`)
Connects directly to Chromium via WebSocket JSON-RPC on port `9222`:
- Streams live runtime console messages (`Runtime.consoleAPICalled`) and network events.
- Captures snapshots (`Page.captureScreenshot`).
- Queries heap usage and DOM count (`Performance.getMetrics`).

### Optional MCP Server Configuration (`mcp_config.json`)
If you want the agent to directly navigate pages, inspect DOM, take on-demand screenshots, and view live Chrome DevTools CDP console logs, configure an MCP server in `~/.gemini/config/mcp_config.json` or `.agents/plugins/`:

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    },
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp"]
    }
  }
}
```

