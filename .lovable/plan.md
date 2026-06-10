# Portfolio v2 — Phased Evolution Plan

This is a very large request (18 work-streams). To keep changes safe, reviewable, and non-breaking, I'll ship it in 5 phases. You can approve the whole plan, or tell me to start at a specific phase / drop items.

**Guarantees across all phases**

- No breaking changes to existing JSON files (all new fields optional, default `visible: false` for new sections).
- Existing components, design language, dark/light, hash nav, auto-hide all preserved.
- Every new file gets a Zod schema + template under `public/templates/` + unit tests.
- Everything stays JSON-driven (no CMS, no DB).

---

## Phase 1 — Data foundation (no UI change yet)

Goal: land all new schemas, JSON files, templates, and the data-layer abstraction so later phases just plug in.

- Add `schemaVersion: "2.0"` field (optional) to schemas; migration helper in `src/data/migrate.ts`.
- New JSON files (all default `visible: false`, empty `items`):
  `timeline.json`, `open-source.json`, `talks.json`, `awards.json`, `blog.json`,
  `startups.json`, `products.json`, `patents.json`, `mentoring.json`,
  `media.json`, `testimonials.json`.
- Add optional `featured?: boolean` to project / publication / achievement / talk item schemas.
- Add `analyticsEnabled: false` + `resumeArchive: []` to `site-config.json` (optional).
- Data-layer abstraction: `src/services/content-source.ts` exposing an interface (`getSection(name)`) with a JSON adapter today; UI imports go through it. Swappable later for CMS/API.
- Templates + snippets for every new file in `public/templates/`.
- Tests: schema validity + templates pass validation.

## Phase 2 — New sections (hidden by default)

Goal: ship components so the moment a user flips `visible: true` + adds items, the section renders.

- Components: `Timeline`, `OpenSource`, `Talks`, `Awards`, `Blog`, `Startups`, `Products`, `Patents`, `Mentoring`, `Media`, `Testimonials`.
- Add them to `site-config.json` `sections[]` (all `visible: false`) and `routes/index.tsx`.
- Each respects existing auto-hide rules (`isSectionRenderable`).
- Featured sub-sections: `FeaturedProjects`, `FeaturedResearch`, `FeaturedAchievements` — auto-hide when no `featured: true` items.
- Auto stats widget (`<Stats />`) computed from visible items — no manual counts.

## Phase 3 — Global Search

- `<CommandPalette />` (Cmd/Ctrl+K) built on shadcn `Command`.
- Indexes visible items across Projects, Skills, Publications, Certifications, Achievements, Talks, Open Source, Blog.
- Real-time fuzzy filter (lightweight: simple scoring, no extra deps — or `fuse.js` if you prefer).
- Highlights matches, full keyboard nav, ARIA labelled.
- Trigger button in `Nav`.

## Phase 4 — SEO, a11y, performance, error boundaries

- SEO: extend route `head()` with OG/Twitter meta + JSON-LD `Person` + `WebSite`; `src/routes/sitemap[.]xml.ts` server route enumerating visible sections; `public/robots.txt`.
- A11y: skip-to-content link, focus-visible styles audit, ARIA labels on icon buttons, semantic landmarks.
- Error boundaries: `<SectionBoundary>` wrapping each section — fallback UI on render/validation error, rest of page survives.
- Perf: lazy-load below-the-fold sections via `React.lazy` + Suspense, memoize heavy lists, `loading="lazy"` on images, route-level code-splitting already on by default.

## Phase 5 — Polish & infra

- Resume archive: read `site-config.resumeArchive[]`, render optional "Resume History" subsection in Contact / About.
- Analytics framework: `src/services/analytics.ts` no-op unless `analyticsEnabled: true`; pluggable provider stub.
- Tests: search filtering, featured filter, timeline ordering, auto-hide for every new section, migration helper round-trip.
- README: document every new file, featured flag, search shortcut, analytics opt-in, resume archive, migration story.

---

## Technical notes

- All new schemas live in `src/data/schema.ts` and are registered in `dataSchemas` so the existing Vite validator picks them up automatically — friendly build errors come for free.
- Typed exports added to `src/data/types.ts` and re-exported through `src/services/content.ts` so component imports stay identical to today.
- `visibleOnly` and `isSectionRenderable` extended; no existing call sites change.
- Featured helper: `featuredOnly(items)` next to `visibleOnly` — filters `visible && featured`.

---

## Questions before I start

1. **Search library**: tiny custom matcher (zero deps) or add `fuse.js` (~6kb gz) for better fuzzy ranking?
2. **Scope to ship now**: all 5 phases in sequence, or stop after Phase 2 so you can review before search/SEO/perf?
3. **Blog**: links out to external URLs only (current plan), or also support rendering full markdown posts later? I'll design the schema accordingly.

Reply with answers (or "all 5 phases, fuse.js, external links only") and I'll execute.
