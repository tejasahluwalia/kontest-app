# Active Context

## Current Objectives
- Implement API endpoints for organizations and contests
- Create GET `/api/organizations/<organization-slug>` endpoint
- Create GET `/api/contests/checkAvailability/:slug` endpoint
- Create POST `/api/organizations/<organization-slug>/contests` endpoint
- Create GET `/api/organizations/<organization-slug>/contests/<contest-slug>` endpoint
- Implement organization membership check middleware

## Recent Decisions
- Organization slug will be used in URLs for better readability
- Contest creation will be restricted to organization members
- Organization endpoints will include related contests
- Contest endpoints will include participants and submissions

## Open Questions
- What fields are required for contest creation?
- How should contest availability check handle edge cases?
- What error handling strategy should be used for the API endpoints?

## Current Blockers
- None identified yet
