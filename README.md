# Unnamed project
A submissions acceptance, management and judging platform for open calls, grants, contests, etc.

## App structure

- `src/client` — Solid 2 + TanStack Router frontend
- `src/server` — Bun server running Elysia 2
- `src/db` — Postgres schema and Drizzle configuration

`bun run build` generates the TanStack Router route tree, creates the frontend
bundle in `dist`, then compiles the Elysia server. Elysia's static plugin serves
the bundle (including the SPA fallback) from `/`.

## UI Libraries (Solid 2)

This project runs `solid-js@2.0.0-rc.0`.
- **Kobalte:** Uses official upstream `@kobalte/core@2.0.0-alpha.0` and `@kobalte/utils@2.0.0-alpha.0`.

| Package | Version | Status |
| --- | --- | --- |
| `@kobalte/core` | `2.0.0-alpha.0` | Upstream (official alpha) |
| `@kobalte/utils` | `2.0.0-alpha.0` | Upstream (official alpha) |

## Commands

- `bun run dev` — watch routes, rebuild the client bundle, and run the server
- `bun run build` — build the client bundle and compiled server
- `bun run start` — run the server from source
- `bun run db-up` / `bun run db-down` — manage the local Postgres container

## Contributing guidelines
-
-
