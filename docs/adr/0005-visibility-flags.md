# ADR-0005 — Visibility flags everywhere

**Status:** Accepted
**Date:** 2026-06-08

## Context

A portfolio that spans decades will accumulate content that's no longer relevant — old jobs, deprecated projects, retired talks. Deleting loses history; commenting out is brittle; an `archived` boolean is ambiguous.

## Decision

Every renderable object (every file root, every item in `items`/`categories`/`stats`/`socials`/`links`) carries a required `visible: boolean`. Helpers (`visibleOnly`, `isSectionRenderable`, `visibleNavSections`) enforce this consistently. Sections with zero visible items auto-hide along with their nav link.

## Consequences

**Positive**
- History is preserved — flip a flag instead of deleting.
- UI never renders an empty heading.
- Nav, search, sitemap, stats, and JSON-LD all agree on what's public.
- New maintainers learn one rule that applies everywhere.

**Negative**
- One extra required field per object. Acceptable cost.
- Forgetting `visible` is a build error — annoying, but better than silently shipping unfinished content.

## Alternatives considered

- **Soft delete (`archived`)** — semantically vague; doesn't compose with section-level hiding.
- **Separate `published/draft` folders** — fragments the data store.
