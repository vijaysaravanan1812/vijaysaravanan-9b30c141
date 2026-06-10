# ADR-0004 — Content abstraction (`content-source.ts`)

**Status:** Accepted
**Date:** 2026-06-08

## Context

The portfolio is meant to outlive any specific backend technology. Forcing components to know whether content comes from JSON, a CMS, a REST API, or a database would make every migration a full rewrite.

## Decision

Introduce a `ContentSource` interface in `src/services/content-source.ts` with a single method `get(key)`. The default adapter (`jsonContentSource`) re-exports from `content.ts`. Components never import the adapter directly — they import typed objects and helpers from `content.ts`, which itself delegates origin to the adapter.

## Consequences

**Positive**

- Migration to a CMS / REST / GraphQL / DB changes one file (`content-source.ts`) + optionally the loader in `content.ts`. No component touched.
- Multiple adapters can coexist (e.g. JSON in dev, API in prod).
- Validation stays at the boundary — every adapter must pass payloads through the same Zod schemas.

**Negative**

- One extra indirection layer for developers to understand.

## Alternatives considered

- **Direct imports everywhere** — simpler today, painful when origin changes.
- **Heavy DI container** — overkill; a single mutable export is enough.
