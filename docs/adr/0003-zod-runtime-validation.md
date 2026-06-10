# ADR-0003 — Zod for runtime validation

**Status:** Accepted
**Date:** 2026-06-08

## Context

TypeScript only checks at compile time. JSON files are edited by humans, and one day data may come from a CMS or API — neither can be trusted to match the compile-time type.

## Decision

Validate every JSON payload with Zod at module-eval time in `src/services/content.ts`, and re-validate on save via a Vite plugin (`plugins/data-schema-validator.ts`). All schemas live in `src/data/schema.ts` and are exported via a `dataSchemas` registry.

## Consequences

**Positive**

- Invalid content fails the build with a precise field path (`items.3.visible — missing required …`).
- The same schemas validate JSON today and CMS/API payloads tomorrow.
- Types are derived (`z.infer`) — single source of truth.
- Tests can validate every real JSON file against its schema.

**Negative**

- A small runtime + bundle cost. Negligible for a portfolio.
- Schema updates must be coordinated with data updates. Mitigated by `schemaVersion` + `migrate.ts`.

## Alternatives considered

- **Hand-written guards** — verbose, easy to drift from types.
- **JSON Schema + Ajv** — works but loses the `z.infer` ergonomics and the dev overlay friendliness.
- **Valibot / Arktype** — equivalent for this use case; Zod chosen for ecosystem maturity.
