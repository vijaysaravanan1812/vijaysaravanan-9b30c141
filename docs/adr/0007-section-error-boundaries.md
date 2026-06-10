# ADR-0007 — Section error boundaries

**Status:** Accepted
**Date:** 2026-06-08

## Context

A bug in one section's data (or its renderer) should not crash the whole portfolio. The site must keep working even when one card throws.

## Decision

Wrap every section render in `<SectionBoundary>` (`src/components/SectionBoundary.tsx`). On error, it shows a small inline fallback and the rest of the page renders normally. Errors are logged for debugging.

## Consequences

**Positive**

- Resilient site. A typo in `talks.json` doesn't blank the page.
- Easy to spot which section is broken in production.

**Negative**

- A swallowed error is one click further from a fix. Mitigated by clear fallback copy + console logs.

## Alternatives considered

- **One global ErrorBoundary** — entire page crashes on any error.
- **Throw and let Vite/SSR fail the build** — fine for build-time, but doesn't help runtime CMS/API errors after we migrate.
