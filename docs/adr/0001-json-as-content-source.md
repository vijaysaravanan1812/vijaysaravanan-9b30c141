# ADR-0001 — JSON as the content source

**Status:** Accepted
**Date:** 2026-06-08

## Context

The portfolio needs a content store that survives decades, is portable across frameworks, requires no infrastructure, and lets a non-developer (future-self in a hurry) edit it from any text editor.

## Decision

Use plain JSON files under `src/data/`, bundled at build time via static `import`.

## Consequences

**Positive**

- Zero infra. No database, no CMS, no auth.
- Diffable in git. Every content change is reviewable.
- Portable. The folder copies cleanly into any future framework.
- Fast. Content is inlined at build time — no network round trip.
- Editable from any machine with a text editor.

**Negative**

- No content editor UI. Mitigated by Zod-driven dev overlay + templates under `public/templates/`.
- All readers see the same content (no per-user personalization). Acceptable for a portfolio.
- Adding a new section requires a build. Acceptable.

## Alternatives considered

- **Markdown + frontmatter** — better for long prose, worse for structured arrays + visibility flags + featured logic.
- **CMS (Strapi / Contentful / Sanity)** — over-engineered for a single-author site; introduces an external dependency that may not exist in 20 years.
- **SQLite committed to git** — opaque diffs, requires a query layer.

## Migration path

`src/services/content-source.ts` defines a `ContentSource` interface so the JSON origin can be swapped for a CMS or API later without touching components. See README → "Future CMS migration guide".
