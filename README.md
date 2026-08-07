# Unnamed project
A submissions acceptance, management and judging platform for open calls, grants, contests, etc.

## App structure

- `src/client` — Solid 2 + TanStack Router frontend
- `src/server` — Bun server running Elysia 2
- `src/db` — Postgres schema and Drizzle configuration

`bun run build` generates the TanStack Router route tree, creates the frontend
bundle in `dist`, then compiles the Elysia server. Elysia's static plugin serves
the bundle (including the SPA fallback) from `/`.

## Temporary UI library bridge (Solid 2)

This project runs `solid-js@2.0.0-beta`, but upstream `@kobalte/core` (0.13.x)
and `@corvu/*` only target `solid-js@^1.8` — their types are incompatible with
Solid 2's renderer-agnostic core (e.g. `ValidComponent` no longer includes
intrinsic element names). Until upstream publishes Solid 2 releases, we use
npm-published bridge forks that track upstream source with minimal changes:

| Upstream package | Bridge fork |
| --- | --- |
| `@kobalte/core` | `@opencenter-cloud/kobalte-core` |
| `@kobalte/tailwindcss` | `@opencenter-cloud/kobalte-tailwindcss` |
| `@corvu/dialog` | `@corvu-next/dialog` |
| `@corvu/otp-field` | `@corvu-next/otp-field` |

All bridge packages are pinned to exact versions — upgrade deliberately and
verify with `bunx tsc --noEmit`.

**Sunset:** once upstream publishes a Solid 2 release (a `solid2`/`next` dist-tag
or a new major of `@kobalte/core`, and corvu support for Solid 2), revert this
with a mechanical find/replace across `src/client` and `package.json`:

```
@opencenter-cloud/kobalte-core         -> @kobalte/core
@opencenter-cloud/kobalte-tailwindcss  -> @kobalte/tailwindcss
@corvu-next/dialog                     -> @corvu/dialog
@corvu-next/otp-field                  -> @corvu/otp-field
```

## Commands

- `bun run dev` — watch routes, rebuild the client bundle, and run the server
- `bun run build` — build the client bundle and compiled server
- `bun run start` — run the server from source
- `bun run db-up` / `bun run db-down` — manage the local Postgres container

## Contributing guidelines
-
-
