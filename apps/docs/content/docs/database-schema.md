---
title: Database Schema
description: Comprehensive database schema documentation for PostgreSQL models managed with Drizzle ORM.
section: Backend & DB
order: 6
badge: Drizzle ORM
slug: database-schema
---

# Database Schema & Models

Kontest models its domain entities using **Drizzle ORM** targeting **PostgreSQL**.

---

## Core Entity Relationship Model

```
+---------------+        +---------------+        +---------------+
|     User      |------->| Organization  |<-------|     Call      |
+---------------+        +---------------+        +---------------+
        |                        |                        |
        v                        v                        v
+---------------+        +---------------+        +---------------+
|     Juror     |        |    Member     |        |     Round     |
+---------------+        +---------------+        +---------------+
        |                                                 |
        +-------------------------------------------------+
                                 |
                                 v
                         +---------------+
                         |  Evaluation   |
                         +---------------+
```

---

## Schema Definitions

### Organizations (`org`)
Represents an organization hosting competitions and submission calls:
- `id`: Text Primary Key
- `name`: Organization display name
- `slug`: Unique URL identifier
- `image`: Logo URL
- `createdAt` / `updatedAt`: Timestamps

### Calls (`call`)
A specific program, grant, or hackathon:
- `id`: Text Primary Key
- `orgId`: Reference to parent organization
- `title`: Program title
- `slug`: Unique slug per organization
- `description`: Overview markdown
- `status`: Draft, Active, Closed, Archived

### Rounds (`round`)
Stages of evaluation within a call (e.g. Qualification, Semifinals, Finals):
- `id`: Text Primary Key
- `callId`: Reference to parent call
- `name`: Round title
- `slug`: URL slug
- `rubric`: JSONB array of scoring criteria, weights, and rating scales
- `startDate` / `endDate`: Evaluation time window

### Submissions & Reviews
- `submission`: Candidate entries with custom JSON form response payloads.
- `evaluation`: Scores given by jurors based on the round rubric.
- `memberInvite`: Pending invites for hosts and teammates.
