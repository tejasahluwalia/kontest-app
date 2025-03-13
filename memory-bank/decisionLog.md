# Decision Log

## Technical Decisions
- Use organization slug in URL for better readability and SEO
- Implement contests listing on organization-specific host page
- Include contest creation form on the host page for convenience

## Implementation Decisions
- Route to `/host/<org-slug>` after organization selection
- Display contests created by the organization on the host page
- Provide form for creating new contests directly on the host page

## Alternatives Considered
- Separate pages for contest listing and creation (rejected for UX simplicity)
- Using organization ID instead of slug in URL (rejected for readability)

## Future Considerations
- Pagination for contests list if it grows large
- Filtering and sorting options for contests
- Role-based access control for contest creation
