# ADR-0008 — TanStack Start over CRA / Next.js

**Status:** Accepted
**Date:** 2026-06-08

## Context

The portfolio needs SSR-friendly routing, file-based routes, optional server functions (for future sitemap / API / webhook needs), and a build pipeline that won't be abandoned anytime soon.

## Decision

Use TanStack Start v1 (Vite 7 under the hood) with file-based routing in `src/routes/`.

## Consequences

**Positive**

- File-based routing with type-safe links.
- Vite — fast dev server, modern bundler, large ecosystem.
- Server functions available when needed (sitemap, future API integrations) without forcing a Node host.
- TanStack Query integration is first-class for the day we add async content.

**Negative**

- Newer than Next.js, smaller community.
- Some Node-only npm packages incompatible with the edge worker runtime (see `<server-runtime>` notes).

## Alternatives considered

- **Create React App** — deprecated, no SSR.
- **Next.js** — heavier, opinionated, app router churn.
- **Astro** — great for content sites, less natural for the React-component-driven UI here.
- **Pure Vite + React Router** — fine, but loses loaders and route-level metadata helpers.
