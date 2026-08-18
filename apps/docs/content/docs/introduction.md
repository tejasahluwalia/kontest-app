---
title: Introduction
description: Overview of Kontest, a high-performance platform for managing hackathons, grants, competitions, and submissions.
section: Overview
order: 1
badge: Start Here
slug: introduction
---

# Introduction to Kontest

**Kontest** is a modern, type-safe submission management and evaluation platform designed for organizations hosting hackathons, developer grants, design awards, and multi-stage competitions.

> [!NOTE]
> Kontest is architected as a clean, high-performance monorepo managed with **pnpm**, utilizing **SolidJS 2** on the frontend, **ElysiaJS** and **Bun** on the backend, and **Drizzle ORM** with PostgreSQL for database persistence.

---

## The Problem Kontest Solves

Managing competitive submission programs traditionally suffers from several bottlenecks:

1. **Rigid Intake Forms**: Organizations need flexible, dynamic schemas tailored to specific rounds, tracks, and submission types without writing custom database migrations each time.
2. **Disconnected Judging Rubrics**: Judges need clear, blind scoring interfaces where quantitative criteria (e.g., technical execution, creativity, impact) and qualitative feedback can be recorded seamlessly.
3. **Multi-Stage Round Progression**: Calls for submissions often have qualification stages, semifinal reviews, and final evaluations with distinct reviewer cohorts.
4. **Disjointed Tech Stacks**: Developers struggle with clunky legacy CMSs or monolithic web frameworks that lack modern type-safety and real-time responsiveness.

---

## Core Capabilities

- **Organization & Role Management**: Multi-tenant organizations with role-based access for Owners, Admins, Jurors, and Applicants.
- **Dynamic Submission Builder**: Configurable form fields supporting custom JSON validation via TypeBox and Valibot.
- **Multi-Round Evaluation Engine**: Define custom scoring rubrics, assign specific judges to entry pools, and calculate weighted rankings.
- **End-to-End Type Safety**: Server endpoints built with Elysia are directly typed to the client via Eden Treaty RPC.
- **Blazing Fast Performance**: Powered by SolidJS 2's fine-grained reactivity and Bun's high-throughput runtime.

---

## Monorepo Layout

The repository is structured into focused, composable packages:

| Package | Path | Purpose |
| :--- | :--- | :--- |
| **`@kontest/client`** | `apps/client` | SolidJS single-page application with reactive state and form management |
| **`@kontest/server`** | `apps/server` | ElysiaJS REST/RPC backend with BetterAuth and security middleware |
| **`@kontest/docs`** | `apps/docs` | Static marketing and documentation site built with Bun and JSX |
| **`@kontest/db`** | `packages/db` | Shared Drizzle ORM schema, PostgreSQL migrations, and TypeBox models |

---

## Next Steps

- Check out the [Getting Started](/docs/getting-started.html) guide to boot the environment locally.
- Review the [Architecture Overview](/docs/architecture.html) to understand the system design.
- Read our [Solid Router Migration Guide](/docs/routing-migration.html) for details on migrating to the SolidJS 2 router.
