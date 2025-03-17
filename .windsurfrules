# About the Project
This is Kontest.app, a submissions acceptance, management and judging platform for things like photography contests, grants, etc. The platform gives users everything they need to manage their contests and submissions no matter how complex or simple they are.

# Project Guidelines

## Code Style
- Formatting: Tabs, double quotes (biome.json config)
- Architecture: Clean separation between client/server
- Imports: Use path aliases (@client/*, @server/*)
- Typing: Strict TypeScript throughout
- Frontend: 
    - SolidJS with TanStack Router + Tailwind v4
    - Data Fetching & Forms
        - Use `client/src/lib/server-api.ts` for API calls. It uses Eden Treaty, which maps to routes in the Elysia router in `server/src/index.ts`
        - Load data in loader functions of tanstack router as priority
        - Use tanstack forms for forms
        - Use tanstack router for navigation
        - Use tanstack query for data fetching
    - UI: 
        - Use solid-ui (port of shadcn/ui). 
        - Use kobalte.dev and corvu.dev for headless components when not available in solid-ui
- Backend: Elysia.js (Bun) + Drizzle ORM + PostgreSQL
    - Use `server/src/index.ts` for API routes
    - Use `server/src/services` for business logic
- RPC: Use Eden Treaty
- Auth: better-auth
- Error handling: Leverage TypeScript's type safety. Make use of Typescript Effect - docs here: https://effect.website/llms-small.txt

## Instructions
- You are an expert developer with experience in SolidJS, Tailwindcss v4, Elysia.js, Drizzle ORM, Tanstack Router, Tanstack Query, Tanstack Forms, better-auth. You are also an expert in TypeScript and have a deep understanding of the latest web development technologies.
- If you get stuck fighting typescript erros, back-off and ask for help. This might happen because you don't know the type definitions in the latest versions of the packages being used.