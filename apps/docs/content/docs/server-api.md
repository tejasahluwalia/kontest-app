---
title: Server API & Eden Treaty
description: Reference documentation for the ElysiaJS backend endpoints, authentication hooks, and Eden Treaty RPC client.
section: Backend & DB
order: 5
badge: API
slug: server-api
---

# Server API & Eden Treaty

The `@kontest/server` application exposes REST and RPC endpoints grouped under `/api`.

---

## Authentication Flow

Authentication is powered by **BetterAuth** with email OTP and session management:

- **Login / Auth Handler**: `/api/auth/*`
- **Session Validation**: Middleware macros `mustAuth` and `maybeAuth` ensure type-safe session injection:

```ts
// plugins/auth.ts
export const betterAuth = new Elysia({ name: "better-auth" })
  .macro({
    mustAuth: {
      async derive({ status, request: { headers } }) {
        const session = await auth.api.getSession({ headers });
        if (!session) return status(401);
        return { user: session.user, session: session.session };
      },
    },
  });
```

---

## API Routes Summary

### 1. Organization & Host Endpoints (`/api/host`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/host/` | List all organizations for the authenticated user |
| `POST` | `/api/host/org` | Create a new organization |
| `GET` | `/api/host/checkAvailability/:slug` | Check if an organization slug is available |
| `GET` | `/api/host/:orgSlug/members` | List members and pending invites for an organization |
| `POST` | `/api/host/:orgSlug/members` | Invite a new user by email |
| `DELETE` | `/api/host/:orgSlug/members/:inviteId`| Cancel an invitation |

### 2. Calls & Rounds (`/api/host/:orgSlug/calls`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/host/:orgSlug/calls` | List calls for the organization |
| `POST` | `/api/host/:orgSlug/calls` | Create a new submission call |
| `GET` | `/api/host/:orgSlug/calls/:callSlug` | Get call details |
| `POST` | `/api/host/:orgSlug/calls/:callSlug/rounds` | Create a new evaluation round |
| `PATCH` | `/api/host/:orgSlug/calls/:callSlug/rounds/:roundSlug` | Update round rubric and dates |

### 3. Juror Endpoints (`/api/juror`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/juror/rounds` | Get rounds assigned to current juror |
| `GET` | `/api/juror/rounds/:roundId/submissions` | Get submissions queued for judging |
| `POST` | `/api/juror/submissions/:subId/score` | Submit rubric evaluations and scores |

---

## End-to-End Type Safety with Eden Treaty

In the client application, import the server type signature for fully typed API requests:

```ts
import { treaty } from "@elysia/eden";
import type { App } from "@kontest/server";

export const client = treaty<App>("http://localhost:3000");

// Full autocomplete and type-checking on endpoints and responses
const { data, error } = await client.api.host.index.get();
```
