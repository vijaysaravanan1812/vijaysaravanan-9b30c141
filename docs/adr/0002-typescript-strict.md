# ADR-0002 — TypeScript (strict mode)

**Status:** Accepted
**Date:** 2026-06-08

## Context

Content shapes have many optional fields, nested arrays, and visibility flags. Drift between schemas and components is the #1 source of bugs in long-lived JSON-driven sites.

## Decision

Use TypeScript with `"strict": true`. Derive every type from its Zod schema via `z.infer` — never hand-write content types.

## Consequences

**Positive**

- Compiler refuses to build when a component reads a removed field.
- Autocomplete documents the schema for free.
- Types and runtime validation can never disagree — both come from the same Zod schema.

**Negative**

- Slightly slower iteration than untyped JS. Mitigated by Vite's fast incremental builds.

## Alternatives considered

- **Plain JavaScript** — fastest to prototype, fails the "20 years from now" maintainability test.
- **JSDoc types** — possible but loses ergonomic features (`z.infer`, conditional types) and editor tooling lags.
