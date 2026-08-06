# Unnamed project
A submissions acceptance, management and judging platform for open calls, grants, contests, etc.

## App structure

- `src/client` — Solid 2 + TanStack Router frontend
- `src/server` — Bun server running Elysia 2
- `src/db` — Postgres schema and Drizzle configuration

`bun run build` generates the TanStack Router route tree, creates the frontend
bundle in `dist`, then compiles the Elysia server. Elysia's static plugin serves
the bundle (including the SPA fallback) from `/`.

## Commands

- `bun run dev` — watch routes, rebuild the client bundle, and run the server
- `bun run build` — build the client bundle and compiled server
- `bun run start` — run the server from source
- `bun run db-up` / `bun run db-down` — manage the local Postgres container

## Contributing guidelines
-
-
