# ADR-0006 — Schema versioning + migrations

**Status:** Accepted
**Date:** 2026-06-08

## Context

A portfolio meant to last decades will change shape. Renaming a field, adding a required one, or splitting a section must not break data written years earlier.

## Decision

Every JSON file may declare an optional `schemaVersion: string`. The current target lives in `src/data/migrate.ts` as `CURRENT_SCHEMA_VERSION`. A `MIGRATIONS` registry keyed by the _old_ version produces the next shape; `migrate()` walks the chain.

## Consequences

**Positive**

- Data written in 2026 still loads in 2046 if migrations exist.
- Migrations can run in place (one-off script) or at load time (CMS/DB origins).
- Each migration is small, testable, and isolated.

**Negative**

- One more concept to learn. Mitigated by inline docs and a worked example in the README.

## Alternatives considered

- **No versioning** — every schema change becomes a manual data sweep with no safety net.
- **Single big migration function** — harder to test and reason about.
