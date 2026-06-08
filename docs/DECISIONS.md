# Architectural Decision Records

This document captures the major architectural decisions that shape this portfolio. Each record follows the classic ADR format: **Context**, **Decision**, **Alternatives Considered**, and **Consequences**.

---

## ADR-001: React + Vite as the UI Foundation

### Context

The portfolio needs a modern, fast, and maintainable frontend stack. It is a content-heavy personal site with interactive sections (search, theme toggling, lazy loading, smooth scrolling), but it is not a full application with complex state management needs. The build tooling must produce optimized static assets that can be deployed anywhere without vendor lock-in.

### Decision

Use **React 19** for UI components and **Vite 7** as the build tool, orchestrated through **TanStack Start** for file-based routing and SSR entry handling.

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| Next.js | Heavy framework with App Router complexity, server-centric architecture, and Vercel-optimized defaults. Overkill for a static portfolio. |
| Gatsby | Plugin ecosystem is aging, build times are slow for large sites, and the GraphQL data layer adds unnecessary abstraction. |
| Astro | Excellent for content sites, but React component reuse and ecosystem familiarity were prioritized over multi-framework islands. |
| Plain HTML/CSS/JS | Would sacrifice component reusability, theming, search interactivity, and long-term maintainability. |
| Svelte / Vue | Both are excellent, but React's ecosystem (Radix UI, TanStack Query, testing libraries) provides the richest accessibility and tooling support. |

### Consequences

- **Fast builds**: Vite's esbuild-based dev server starts in milliseconds. Production builds complete in seconds, not minutes.
- **Tree-shaking**: Unused code is eliminated automatically, keeping bundle sizes minimal.
- **Hot Module Replacement**: Changes to React components or data JSON reflect instantly during development.
- **Future-proof**: React 19 and Vite 7 are actively maintained with large ecosystems. Replacing either in the future is possible because the app logic is decoupled from framework specifics via the content abstraction layer.

---

## ADR-002: JSON Files Instead of a CMS

### Context

Portfolio content (profile, experience, projects, skills, publications, etc.) needs to be editable by the site owner without developer intervention, but the site does not require frequent real-time updates, multi-user collaboration, or rich text editing. The content is structured, predictable, and version-controlled alongside code.

### Decision

Store all content as **static JSON files** under `src/data/*.json`, validated at build time by Zod schemas. The content is bundled at build time, not fetched at runtime.

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| Headless CMS (Strapi, Contentful, Sanity) | Adds hosting cost, network dependency, API rate limits, and vendor lock-in. Requires an always-online service for a site that updates monthly at most. |
| Markdown + frontmatter | Good for blog posts, but poor for highly structured data (nested objects, arrays with visibility flags, typed fields). Would require a parsing layer that duplicates what Zod already provides. |
| Notion as CMS | Requires API keys, network calls, and has rate limits. Content is not version-controlled with the code. |
| SQLite / PostgreSQL | Adds operational complexity (migrations, backups, connection strings) for data that changes infrequently and fits comfortably in JSON. |
| YAML / TOML | Less tooling support than JSON. No native TypeScript import support. Zod has first-class JSON parsing. |

### Consequences

- **Zero runtime dependencies**: No API calls, no CMS downtime, no CORS issues. The site works offline once built.
- **Version-controlled content**: Content changes are code changes. Rollbacks, diffs, and audits are handled by Git.
- **Type safety**: JSON is imported as typed modules via `src/services/content.ts`. TypeScript knows the exact shape of every field.
- **Build-time validation**: The Vite plugin `plugins/data-schema-validator.ts` catches malformed data before deployment. Broken JSON fails the build.
- **Migration path**: When the site outgrows JSON, the content abstraction layer (`src/services/content.ts`) can be swapped for a CMS adapter without touching UI components. See `docs/architecture/future-cms-migration.md`.

---

## ADR-003: TypeScript for the Entire Codebase

### Context

A portfolio maintained for decades must resist bit-rot. JavaScript's dynamic typing makes refactors dangerous and silently breaks APIs. The project has complex data structures (20+ JSON schemas, nested visibility flags, union types) and a growing test suite that needs reliable type inference.

### Decision

Use **TypeScript 5.8** with `strict: true` for all source code, tests, and tooling configuration.

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| JavaScript (ES2022) | No compile-time safety. Refactoring `visible` to `isVisible` across 20 files would be a global search-and-replace gamble. |
| JSDoc types | Provides some IntelliSense but no compile-time enforcement. Cannot express complex generic types like `Visible<T>` or `Featurable<T>`. |
| Flow | Largely abandoned by the community. Inferior ecosystem integration compared to TypeScript. |
| Deno / Bun runtime types | Not relevant — the decision is about the type system, not the runtime. TypeScript compiles to JavaScript that runs everywhere. |

### Consequences

- **Refactor safety**: Renaming a field or changing a type propagates errors at compile time, not in production.
- **Self-documenting code**: Function signatures declare intent. `visibleOnly<T extends { visible: boolean }>(items: readonly T[]): T[]` documents itself.
- **IDE support**: Autocomplete, inline documentation, and jump-to-definition work across the entire project.
- **Schema-to-type pipeline**: Zod schemas automatically produce TypeScript types via `z.infer<typeof schema>`, eliminating the drift between runtime validation and compile-time types.
- **CI enforcement**: `bun run typecheck` (`tsc --noEmit`) runs in CI. Type errors block deployment.

---

## ADR-004: Zod for Schema Validation

### Context

Content lives in JSON files edited by humans. Humans make mistakes: missing required fields, wrong types, typos in enum values. The site must fail loudly and clearly when data is invalid, and it must produce helpful error messages that point to the exact field.

### Decision

Use **Zod 3.x** as the single source of truth for all data schemas. Every `src/data/*.json` file has a corresponding Zod schema in `src/data/schema.ts`. Validation runs at build time (via Vite plugin) and at runtime (via `src/services/content.ts`).

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| JSON Schema + ajv | JSON Schema is verbose and lacks native TypeScript inference. Would require maintaining a separate type definition file. |
| Yup | Similar to Zod but larger bundle size and less ergonomic for nested object arrays. |
| io-ts | Powerful but has a steeper learning curve and heavier functional programming style. Zod's API is more approachable. |
| Manual `if (!data.field) throw` | Fragile, repetitive, and produces poor error messages. Does not scale to 20+ schemas with nested structures. |
| No validation | Would allow broken data to silently corrupt the UI or crash React components at render time. |

### Consequences

- **Single source of truth**: `src/data/schema.ts` defines both runtime validation rules and TypeScript types. No duplication.
- **Excellent error messages**: Zod reports `experience.items[2].highlights — Required` instead of a generic "validation failed."
- **Composable schemas**: Shared patterns like `visible`, `featured`, and `schemaVersion` are defined once and reused across 20+ schemas.
- **Build-time enforcement**: The Vite plugin fails the build on invalid data. No broken JSON can reach production.
- **Runtime safety**: Even if someone bypasses the build step, `src/services/content.ts` re-validates at module load time and throws with a descriptive message.
- **Future-proof**: `schemaVersion` fields in every JSON file enable gradual migrations. See `src/data/migrate.ts` and `tests/migrations/`.

---

## ADR-005: Single-Page Architecture with Section Scrolling

### Context

The portfolio is a curated narrative: hero, about, experience, projects, skills, and so on. Visitors expect to scroll through the story linearly. Each section is relatively lightweight, and the total content fits comfortably in a single page without performance issues. Deep-linking to specific sections is important (e.g., sharing `/#projects`).

### Decision

Render all content sections on a single route (`/`), with each section wrapped in a `<section id="...">`. Navigation uses smooth scroll to section anchors. Below-the-fold sections are lazy-loaded via React `lazy()` + `Suspense`.

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| Multi-page routes (`/about`, `/projects`, etc.) | Breaks the narrative flow. Requires full page reloads or complex route-level state sharing. Harder to maintain a consistent scroll experience. |
| Virtual scrolling | Unnecessary complexity. The page is not infinite — all content is known at build time and fits in memory. |
| Pagination | Inappropriate for a portfolio. Visitors should not click "Next" to see more achievements. |
| Tabs / accordion layout | Hides content behind interaction barriers. Search engines and users scanning the page cannot see all content at once. |
| Full-screen slide transitions | Flashy but frustrating for users who want to skim or search. Breaks browser find-in-page. |

### Consequences

- **Narrative coherence**: The page tells a story from top to bottom. Visitors scroll naturally through the owner's career.
- **Instant navigation**: Clicking a nav item smooth-scrolls to the section. No page reloads, no loading spinners.
- **Deep-linking**: `https://example.com/#projects` scrolls directly to the Projects section. Hash is updated via `history.replaceState`.
- **Searchability**: Browser find-in-page works across all content. The search palette can index every section without cross-page coordination.
- **SEO-friendly**: A single canonical URL concentrates ranking signals. JSON-LD structured data in `<head>` describes the entire person.
- **Performance**: Critical sections (hero, about, featured) are eager-loaded. Heavy sections (timeline, testimonials, media) are code-split and lazy-loaded.
- **Error isolation**: Each section is wrapped in `SectionBoundary`, a React error boundary. A crash in one section does not break the entire page.

---

## ADR-006: Hash Anchors for In-Page Navigation

### Context

On a single-page site, users need to jump to specific sections. The URL should reflect where they are so links can be shared. The navigation must work without a server-side routing layer.

### Decision

Use **hash anchors** (`#about`, `#projects`) for in-page section navigation. The `Nav` component intercepts click events, calls `element.scrollIntoView({ behavior: "smooth" })`, and updates the URL via `history.replaceState(null, "", "#${id}")`.

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| Full client-side routing (TanStack Router paths like `/about`) | Would create separate route files for each section, fragmenting the single-page experience. Each route would need its own loader and meta tags, duplicating the index page structure. |
| Scroll-to without URL update | Breaks shareability. Users cannot copy a link that points to a specific section. |
| Query params (`?section=projects`) | Ugly URLs. Harder to parse. Does not leverage native browser anchor behavior. |
| Third-party scroll library | Adds dependency weight for behavior (`scrollIntoView`) that the browser natively supports. |

### Consequences

- **Native browser behavior**: `https://example.com/#projects` works on first load — the browser auto-scrolls to the element with `id="projects"`.
- **Shareable links**: Any section can be bookmarked or shared.
- **No server configuration**: Hash changes are purely client-side. No rewrite rules or SSR handling required.
- **Accessibility**: Skip links and keyboard navigation work with standard `<a href="#section">` semantics.
- **Active section tracking**: `IntersectionObserver` in the `Nav` component highlights the currently visible section based on viewport position, synced with the hash state.

---

## ADR-007: Visibility Flags on Every Section and Item

### Context

A portfolio is not static — it evolves. New sections are drafted before publication. Projects are hidden when deprecated. Publications are selectively featured. The owner needs fine-grained control over what appears without deleting data or changing code.

### Decision

Every section file has a top-level `visible: boolean`. Every item within arrays (projects, experience, publications, etc.) also has its own `visible: boolean`. A `featured?: boolean` flag exists on items that can be highlighted. The `site-config.json` `sections` array controls section-level visibility independently from item-level visibility.

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| Commenting out JSON entries | Brittle. Comments are not valid in JSON. Would require a pre-processor or manual field removal. |
| Separate "draft" and "published" files | Doubles the file count. Harder to migrate content from draft to published. No single source of truth. |
| Date-based visibility (`publishAfter: "2025-01-01"`) | Adds complexity (time zones, clock skew, scheduler logic). Most content changes are manual decisions, not scheduled events. |
| Deleting hidden items | Permanent data loss. The owner may want to re-enable a section later without reconstructing it from memory or Git history. |
| CMS workflow states | Requires a CMS. This project intentionally avoids CMS dependencies. |

### Consequences

- **Non-destructive hiding**: Set `visible: false` to hide. The data is preserved. Re-enable by setting `visible: true`.
- **Layered control**: Section can be `visible: true` in `site-config.json` but still hidden if all its items are `visible: false` (the `isSectionRenderable()` helper handles this).
- **Featured curation**: `featured: true` on select items allows a "Featured" section to surface the best work without duplicating data.
- **Testability**: The visibility system is fully tested. `tests/visibility/`, `tests/unit/`, and `tests/integration/` verify that hidden items never render and that nav menus only include renderable sections.
- **Future sections**: 20+ sections are pre-defined in `site-config.json` with `visible: false`. Enabling a new section is a one-line JSON change — zero code changes.

---

## ADR-008: Static Hosting Target

### Context

The portfolio is a personal site with no server-side state, no user accounts, no database, and no dynamic rendering needs. It must be deployable to the cheapest, most reliable, and most portable hosting available.

### Decision

Target **static hosting** exclusively. The build produces a `dist/` folder containing HTML, CSS, JS, and assets. This folder is uploaded to any static host.

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| Server-side rendering (SSR) at runtime | Requires a running Node.js / edge process. Adds cost, complexity, and cold-start latency for a site with no dynamic data. |
| Serverless functions for content | Overkill. Content is static JSON bundled at build time. No API endpoints are needed for portfolio display. |
| Docker container deployment | Adds operational overhead (registry, orchestration, scaling) for a site that serves pre-built files. |
| Managed platform (Vercel, Netlify) with SSR | These platforms support static hosting perfectly well. The decision is to use their *static* offering, not their serverless offering. |

### Consequences

- **Universal deployability**: `dist/` can be served by GitHub Pages, Vercel, Netlify, Cloudflare Pages, AWS S3 + CloudFront, Nginx, Apache, or any web server.
- **Zero hosting cost**: GitHub Pages, Netlify, and Cloudflare Pages all offer free tiers for static sites.
- **Maximum uptime**: Static files on a CDN have no runtime dependencies that can fail. No database connections to drop, no server processes to crash.
- **Instant global distribution**: CDN edge caches serve files from the nearest location. No origin server latency.
- **Security surface area**: No server runtime means no server-side injection attacks, no dependency vulnerabilities in production runtime, no secret management on the server.
- **Disaster recovery**: The entire site is in `dist/`. Mirror it to multiple providers. Recovery is re-uploading a folder.
- **Build once, deploy anywhere**: The same `dist/` artifact is deployed to preview, staging, and production without rebuild.

---

## ADR-009: Content Abstraction Layer

### Context

Today's content source is JSON files. Tomorrow's might be a headless CMS, a GraphQL API, or a PostgreSQL database. If components directly import JSON files, migrating the content source requires touching every component.

### Decision

All content access flows through `src/services/content.ts`. This file imports raw JSON, validates it through Zod schemas, exports frozen objects, and provides helper functions (`visibleOnly`, `featuredOnly`, `autoStats`, `isSectionRenderable`, `visibleNavSections`). Components import from `src/services/content.ts`, never directly from `src/data/*.json`.

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| Direct JSON imports in components | Would couple every component to the current file structure. Changing to a CMS would require editing 20+ component files. |
| React Context + useReducer | Adds unnecessary runtime complexity. Content does not change after initial load. Context is useful for mutable state, not static data. |
| TanStack Query for local JSON | Overkill. No network request, no caching strategy, no stale-while-revalidate needed. JSON is already in the bundle. |
| Global window object | Breaks type safety. Introduces global mutable state. Impossible to test in isolation. |

### Consequences

- **Single point of change**: To swap JSON for a CMS, only `src/services/content.ts` needs replacement. Every component remains untouched.
- **Validation at the boundary**: Invalid data is caught when the module loads, not when a component renders. Error messages name the exact file and field.
- **Immutable data**: `Object.freeze()` prevents accidental mutation at runtime.
- **Computed values**: `autoStats()` derives counts (projects, publications, certifications) from validated data. Manual counting is eliminated.
- **Testability**: The content service can be mocked in tests. Fixtures in `tests/fixtures/` exercise edge cases without touching real data files.
- **Documentation**: The file's JSDoc header explicitly documents the migration path: "To swap in a CMS or HTTP API later, replace the imports below with another adapter."

---

## ADR-010: Test-Driven Content Validation

### Context

Content is the most frequently changed part of the portfolio. It is edited by a non-developer (the site owner) in JSON files. Mistakes in JSON structure, visibility logic, or navigation generation can break the site silently. The test suite must protect the architectural invariants that make the portfolio reliable.

### Decision

Enforce content correctness through automated tests at multiple levels:

1. **Schema tests** (`tests/schemas/`): Every JSON file is validated against its Zod schema. Fixtures test valid and invalid inputs.
2. **Content service tests** (`tests/content/`): `visibleOnly`, `featuredOnly`, `autoStats`, and section renderability are unit-tested with edge cases.
3. **Visibility tests** (`tests/visibility/`): Hidden sections and items must not appear in navigation or DOM.
4. **Navigation tests** (`tests/navigation/`): Menu generation matches `site-config.json` sections. Active section tracking works.
5. **Integration tests** (`tests/integration/`): End-to-end flows from JSON data through the content service to React rendering.
6. **Migration tests** (`tests/migrations/`): Schema version migrations are round-trip tested.

Coverage thresholds are enforced in CI: 90% statements, 90% functions, 90% lines, 85% branches.

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| Manual QA before every deploy | Unreliable, time-consuming, and does not scale. Humans miss edge cases. |
| No tests, trust Zod | Zod catches schema violations but cannot test *behavior*: "does hidden item X appear in the nav?" "does `autoStats()` count correctly?" |
| Snapshot testing only | Snapshots break on every content change and provide no semantic understanding of what broke. |
| End-to-end tests with Playwright | Useful, but slower and flakier than unit/integration tests. The test pyramid prioritizes fast, reliable lower-level tests. |
| Linting only (ESLint, Prettier) | Catches code style, not logic correctness. Cannot verify that `visible: false` suppresses a section. |

### Consequences

- **Regression protection**: A test fails if a visibility flag is accidentally inverted, if a schema field is renamed without migration, or if navigation logic omits a section.
- **Safe refactors**: Changing the content service implementation is safe when 90%+ coverage confirms no behavioral change.
- **Living documentation**: Tests declare the expected behavior of visibility, navigation, and search. New contributors read tests to understand the system.
- **CI gate**: The GitHub Actions workflow runs tests on every push. Coverage drops below threshold block deployment.
- **Migration confidence**: When schemaVersion changes, migration tests prove that old data transforms correctly into the new shape.
- **Confidence for non-developers**: A content editor can change JSON knowing that CI will catch structural mistakes before deployment.

---

## Summary Table

| ADR | Decision | Status | Reversible? |
|-----|----------|--------|-------------|
| 001 | React 19 + Vite 7 + TanStack Start | Active | Yes — components are plain React |
| 002 | JSON files for content | Active | Yes — abstraction layer supports CMS swap |
| 003 | TypeScript strict mode everywhere | Active | No — would require full rewrite |
| 004 | Zod for schema validation | Active | Yes — could swap for io-ts or Yup |
| 005 | Single-page architecture | Active | Yes — could split into routes later |
| 006 | Hash anchors for navigation | Active | Yes — could switch to query params |
| 007 | Visibility flags on all content | Active | Yes — flags can be removed, data preserved |
| 008 | Static hosting target | Active | Yes — could add SSR later if needed |
| 009 | Content abstraction layer | Active | Yes — the point is to make it reversible |
| 010 | Test-driven content validation | Active | Yes — test strategy can evolve |

---

*Last updated: 2026-06-08*
*See also: `docs/architecture/` for detailed system diagrams, `docs/data-model.md` for field-level data documentation, and `tests/README.md` for test suite organization.*
