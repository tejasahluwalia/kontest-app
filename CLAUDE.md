# Project Guidelines for Claude

## Code Style
- Formatting: Tabs, double quotes (biome.json config)
- Architecture: Clean separation between client/server
- Imports: Use path aliases (@client/*, @server/*)
- Typing: Strict TypeScript throughout
- Frontend: 
    - SolidJS with TanStack Router + Tailwind
    - Data Fetching & Forms
        - Use `client/src/lib/server-api.ts` for API calls. It uses Eden Treaty, which maps to routes in the Elysia router in `server/src/index.ts`
        - Use tanstack forms for forms
        - Use tanstack router for navigation
        - Use tanstack query for data fetching
    - UI: 
        - Use solid-ui (port of shadcn/ui). 
        - Use kobalte.dev and corvu.dev for headless components when not available in solid-ui
- Backend: Elysia.js (Bun) + Drizzle ORM + PostgreSQL
    - Use `server/src/index.ts` for API routes
- RPC: Use Eden Treaty
- Auth: Email OTP via better-auth
- Database: CUID2 for IDs
- Error handling: Leverage TypeScript's type safety
- Typescript: Use Effect - docs here: https://effect.website/llms-small.txt
