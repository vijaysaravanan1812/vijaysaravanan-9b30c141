# Portfolio — JSON-Driven Personal Site

[![CI](https://github.com/vijaysaravanan/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/vijaysaravanan/portfolio/actions/workflows/ci.yml)
![Coverage](https://img.shields.io/badge/coverage-enforced%20in%20CI-2ea44f)

A modern, dark-themed personal portfolio built with **React 19 + TanStack Start + Vite + TypeScript + Tailwind v4**. All content lives in JSON files under `src/data/` and is validated by Zod — adding, removing, hiding, reordering, or featuring content never requires a React change.

This README is intentionally long. It is the single source of truth for:

1. **Users** — how to edit content.
2. **Developers** — how the architecture works and how to extend it.
3. **Future maintainers (including future-you, decades from now)** — how to migrate the content layer to a CMS, REST API, GraphQL API, or database without rewriting the UI.

> If you only want to update content, jump to [Editing content](#editing-content). Everything else is reference material.

---

## Table of contents

1. [Stack](#stack)
2. [Run locally](#run-locally)
3. [Editing content](#editing-content)
4. [Current architecture](#current-architecture)
5. [Content architecture](#content-architecture)
6. [Abstraction layers](#abstraction-layers)
7. [Future CMS migration guide](#future-cms-migration-guide)
8. [Future API migration guide](#future-api-migration-guide)
9. [Database migration guide](#database-migration-guide)
10. [Schema evolution](#schema-evolution)
11. [Long-term maintenance guide](#long-term-maintenance-guide)
12. [Resume management](#resume-management)
13. [Backup strategy](#backup-strategy)
14. [Architecture Decision Records](#architecture-decision-records)
15. [Future expansion roadmap](#future-expansion-roadmap)
16. [Developer onboarding](#developer-onboarding)
17. [Tests](#tests)
18. [Competitive Programming](#competitive-programming)

---

## Stack

- **React 19** — UI library.
- **TanStack Start v1** (Vite 7 under the hood) — file-based routing in `src/routes/`, optional server functions, SSR-ready.
- **TypeScript (strict)** — every content shape is typed end-to-end via `z.infer`.
- **Zod** — runtime + build-time validation for every JSON file.
- **Tailwind CSS v4** — CSS-first design tokens in `src/styles.css`.
- **Lucide** icons, **shadcn/ui** primitives.
- **Vitest** — unit tests.
- Fully static at runtime — no backend, no database, deployable anywhere.

---

## Run locally

```bash
bun install
bun run dev          # http://localhost:3000
```

Build / preview:

```bash
bun run build
bun run start
```

---

## Editing content

Every content file lives in `src/data/`:

```
src/data/
├── site-config.json    ← section visibility, order, rotating roles, analyticsEnabled, resumeArchive
├── profile.json        ← hero name, role, summary, stats, socials
├── about.json          ← long-form bio + "how I work" principles
├── experience.json     ← work history
├── projects.json       ← project cards (problem / outcome) — supports "featured": true
├── skills.json         ← grouped skill chips
├── education.json
├── publications.json   ← supports "featured": true
├── certifications.json
├── achievements.json   ← supports "featured": true
├── contact.json
│
│  ── v2 additions ──
├── timeline.json       ← career milestones
├── open-source.json
├── talks.json          ← supports "featured": true
├── awards.json
├── blog.json           ← external blog posts
├── startups.json
├── products.json
├── patents.json
├── mentoring.json
├── media.json
└── testimonials.json
```

### The golden rules

1. **Every object that can be shown/hidden has its own `visible: boolean`** — the file root *and* every item inside `items` / `stats` / `socials` / `categories` / `links`. Both required.
2. **Order in JSON = order on the page.** No sort logic, no `order` field.
3. **Section order and nav labels live in `site-config.json → sections`.**
4. **Save → hot reload.** Restart only when adding a brand-new file (so the validator picks it up).
5. **Never edit a `.tsx` file to add content.** If you feel the urge, the schema is missing a field — extend `src/data/schema.ts` instead.

### Visibility model

| Goal | Edit | Value |
| --- | --- | --- |
| Hide a single item | the item's `visible` | `false` |
| Hide section + nav link, keep data | the section file's root `visible` | `false` |
| Hide nav link only (section still reachable by anchor) | `site-config.json → sections[id].visible` | `false` |
| Remove a section permanently | delete the file *and* its entry in `site-config.json → sections` | — |

A section auto-hides when its root says visible but **zero items are visible**. No empty heading is ever rendered.

### Featured items

Add `"featured": true` to any **project, publication, achievement, or talk** to surface it in the "Featured" block at the top of the page. The block auto-hides when nothing is featured.

### Global search (⌘K / Ctrl+K)

The command palette indexes every visible item across Projects, Skills, Publications, Certifications, Achievements, Awards, Talks, Open Source, and Blog. Hidden items are never indexed.

### Schema-safe templates

Every section ships with a ready-to-use template under `public/templates/` (served at `/templates/<file>.json` in dev and production). Two ways to use them:

1. **Whole section** — overwrite `src/data/<file>.json`.
2. **Single item** — copy from `public/templates/_item-snippets.json` and append.

Templates are tested against the Zod schemas (`src/data/__tests__/templates.test.ts`).

### Common pitfalls

- Forgetting `visible` on a new item — Zod fails the build with the exact field path.
- `"visible": "true"` (string) instead of `true` (boolean).
- Hiding a section in `site-config.json` but leaving the data file `visible: true` (or vice versa). Both must agree.
- Renaming `sections[].id` — that id is also the URL hash (`/#projects`) and the key `isSectionRenderable` switches on. Renaming breaks deep links.
- Trailing commas / unquoted keys — JSON is strict.

---

## Current architecture

### Tech layers

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (React 19)                                         │
│    Hero · Nav · SearchPalette · Section components          │
└─────────────────────┬───────────────────────────────────────┘
                      │ imports typed, frozen objects
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Content service        src/services/content.ts             │
│    - load() runs Zod schemas at module-eval time            │
│    - Object.freeze() prevents accidental mutation           │
│    - visibleOnly / featuredOnly / isSectionRenderable       │
│    - autoStats()                                            │
└─────────────────────┬───────────────────────────────────────┘
                      │ uses                          
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Content source         src/services/content-source.ts      │
│    ContentSource interface — swap adapter to change origin  │
│    Default adapter: re-exports from content.ts (JSON)       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Schemas                src/data/schema.ts                  │
│    Zod schemas + dataSchemas registry                       │
│    Vite plugin (plugins/data-schema-validator.ts) re-checks │
│    every JSON on save and shows errors in the dev overlay   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Data files             src/data/*.json                     │
│    Bundled at build time (import x from "@/data/x.json")    │
└─────────────────────────────────────────────────────────────┘
```

### Section rendering flow

```
site-config.json
        │
        ▼
visibleNavSections()  ◄── filters by sections[].visible AND isSectionRenderable(id)
        │
        ▼
   <Nav />            ◄── desktop + mobile nav, search button, theme toggle
        │
        ▼
   <Page>             ◄── src/routes/index.tsx
        │
        ▼
   For each section id in visibleNavSections():
        ├── <SectionBoundary>           ← catches errors so one bad item
        │      └── <Section component/>   doesn't crash the whole page
```

### Content loading flow

1. Vite bundles every `src/data/*.json` at build time via static `import`.
2. `plugins/data-schema-validator.ts` watches `src/data/` in dev — any save re-runs Zod and surfaces errors in the Vite overlay.
3. `src/services/content.ts` runs every schema once at module-eval and freezes the result. Invalid data fails fast with a precise path (`items.3.visible — missing required …`).
4. Components import named exports (`projects`, `publications`, …) or call `visibleOnly()`, `featuredOnly()`, `isSectionRenderable()`, `autoStats()`.

### Theme system

`src/hooks/use-theme.ts` toggles `data-theme="dark|light"` on `<html>` and persists the choice in `localStorage`. Tokens live in `src/styles.css` (`:root` + `[data-theme="dark"]`). Components only reference semantic tokens (`bg-background`, `text-foreground`, …) — never raw colors.

### Search system

`src/components/SearchPalette.tsx`:

- Mounted globally; opens with `Cmd+K` / `Ctrl+K` or the search button in the nav.
- Indexes only **visible** items across projects, skills, publications, certifications, achievements, awards, talks, open source, blog.
- Plain in-memory substring match, no external dependency. Index is rebuilt on mount, which is fine because content is bundled.

### Routing / navigation

- File-based routing under `src/routes/`. The home page is `src/routes/index.tsx` and is the only content route — sections live on the same route and are reached via `#anchor` hashes.
- `src/routes/sitemap[.]xml.ts` emits a dynamic sitemap from `visibleNavSections()`.
- `public/robots.txt` allows everything and points at the sitemap.
- Per-route `head()` provides Open Graph, Twitter, and JSON-LD (`Person`, `WebSite`).

---

## Content architecture

### Where content is stored

`src/data/*.json` — bundled, validated, version-controlled. There is no external content store today.

### How JSON files are structured

Each file has:

- An optional `schemaVersion: "2.0"` string.
- A root `visible: boolean`.
- A payload — either a flat object (profile, about, contact) or an `items` / `categories` array of objects, each with their own `visible: boolean`.
- Optional `featured: boolean` on items in projects, publications, achievements, talks.

### How visibility flags work

Single source of truth: `src/services/content.ts`.

```ts
visibleOnly(items)        // strips items where visible === false
featuredOnly(items)       // visible AND featured === true
isSectionRenderable(id)   // nav AND root visible AND at least one visible item
visibleNavSections()      // sections to actually render
```

### How sections auto-hide

`isSectionRenderable("projects")` returns `false` when **any** of these is true:

- `site-config.json → sections.projects.visible === false`
- `projects.json → visible === false`
- `visibleOnly(projects.items).length === 0`

Nav links and the section itself disappear together — there is never a heading without content.

### How featured items work

Items opt in with `"featured": true`. `<Featured />` (in `src/components/Featured.tsx`) reads `featuredOnly(projects.items)`, `featuredOnly(publications.items)`, etc. The Featured block itself auto-hides when nothing is featured.

### How search indexes content

`SearchPalette` builds an array of `{ section, label, hint, href }` records from `visibleOnly(...)` of every searchable file. No persistent index, no service worker — rebuilt cheap on open.

### Examples

```jsonc
// projects.json
{
  "schemaVersion": "2.0",
  "visible": true,
  "items": [
    {
      "visible": true,
      "featured": true,
      "title": "Distributed key-value store",
      "tags": ["Systems"],
      "stack": ["Go", "Raft"],
      "duration": "Q1 2026",
      "problem": "Single-node KV blew up at 10k qps.",
      "outcome": "Sharded + replicated; sustained 80k qps p99 < 12 ms.",
      "github": "https://github.com/...",
      "demo": ""
    }
  ]
}
```

```jsonc
// site-config.json (excerpt)
"sections": [
  { "id": "projects", "label": "Projects", "visible": true },
  { "id": "blog",     "label": "Writing",  "visible": true }
]
```

---

## Abstraction layers

The project has **two main layers** between data and UI. They exist so the data origin (JSON, CMS, REST, GraphQL, database) can change without touching components.

### Content layer

```
UI Components
        ↓
Content Service     (src/services/content.ts)
        ↓
Content Source      (src/services/content-source.ts)
        ↓
JSON Files          (src/data/*.json)
```

- **UI components** know nothing about Zod, fetch, files, or schemas. They import a typed object and call helpers.
- **Content service** parses + freezes + exposes helpers (`visibleOnly`, `featuredOnly`, `isSectionRenderable`, `autoStats`). Single chokepoint.
- **Content source** is a tiny interface (`ContentSource.get(key)`). The default adapter just re-exports from the service. Swap the adapter to change origin.
- **JSON files** are the current origin.

### Rendering layer

```
Page                 (src/routes/index.tsx)
        ↓
Section Renderer     (visibleNavSections() + <SectionBoundary>)
        ↓
Typed data           (z.infer<typeof schema>)
        ↓
Reusable components  (<Projects />, <Skills />, …)
```

### Why these abstractions exist

| Abstraction | Why |
| --- | --- |
| Zod schemas | Validate JSON at build + dev time; types are derived, never hand-written. |
| `content.ts` chokepoint | If the origin changes, only this file is touched. |
| `content-source.ts` | Lets multiple adapters coexist (JSON for dev, API for prod). |
| `visibleOnly` / `isSectionRenderable` | UI never re-implements visibility — guarantees consistency. |
| `<SectionBoundary>` | One bad section can't crash the page. |
| `autoStats()` | Stats can never drift from reality — they're derived. |

---

## Future CMS migration guide

Goal: replace the JSON origin with a CMS (Strapi / Contentful / Sanity / Directus / Ghost / Payload …) **without touching components**.

### Today

```
ProjectsSection
        ↓
contentService
        ↓
projects.json
```

### After CMS migration

```
ProjectsSection
        ↓
contentService  (unchanged)
        ↓
ContentSource = CMSAdapter
        ↓
CMS API (REST / GraphQL)
```

### Steps

1. **Model in the CMS.** Mirror each Zod schema as a CMS content type. Keep field names identical — `visible`, `featured`, `items`, etc.
2. **Write a `cmsContentSource`** in `src/services/content-source.ts`:

   ```ts
   export const cmsContentSource: ContentSource = {
     get: (key) => cmsCache[key], // populated at build or request time
   };
   ```

3. **Validate at the boundary.** Run the same Zod schemas (`dataSchemas`) against CMS payloads — never trust the network.
4. **Swap the active source.** Change one line:
   ```ts
   export const contentSource: ContentSource = cmsContentSource;
   ```
5. **Keep `visibleOnly` / `featuredOnly` / `isSectionRenderable` intact.** Those are pure functions over typed data — origin-agnostic.

### What changes vs. stays

| Layer | Change? |
| --- | --- |
| Components (`src/components/*`) | **No.** |
| `src/services/content.ts` | Minor — read from `contentSource.get(...)` instead of static imports. |
| `src/services/content-source.ts` | **Yes** — add the CMS adapter. |
| `src/data/schema.ts` | **No.** Schemas validate either origin. |
| `src/data/*.json` | Can be archived; CMS becomes the source of truth. |

### Why the UI doesn't change

Components only see `z.infer<typeof schema>` objects + helper functions. They have no knowledge of where the bytes came from. The Zod schemas guarantee shape, not origin.

---

## Future API migration guide

Same idea, different origin.

### Today

```
getProjects()
        ↓
projects.json
```

### Future — REST

```
getProjects()
        ↓
fetch("/api/projects")
        ↓
zod.parse(...)
```

### Future — GraphQL

```
getProjects()
        ↓
graphqlClient.query(PROJECTS_QUERY)
        ↓
zod.parse(...)
```

### Layers already abstracted

- `ContentSource` interface (`src/services/content-source.ts`).
- Zod schemas (`src/data/schema.ts`) — runtime validation for any payload.
- Helpers (`visibleOnly`, etc.) — pure functions, origin-agnostic.

### Files that change

- `src/services/content-source.ts` — new adapter.
- `src/services/content.ts` — read from `contentSource` for the sections moving to API; keep static imports for the rest. Migration can be **incremental, section by section.**

### Files that don't change

- All `src/components/*`.
- `src/data/schema.ts`.
- `src/data/types.ts`.
- `src/routes/index.tsx`.

---

## Database migration guide

```
JSON
  ↓ (CMS or REST API)
  ↓
Database (PostgreSQL / MySQL / MongoDB)
```

### Recommended architecture

```
Browser
   ↓
TanStack Start server function / route (src/routes/api/…)
   ↓
ORM (Drizzle / Prisma / Mongoose) — Zod validation at boundary
   ↓
PostgreSQL / MySQL / MongoDB
```

### Steps

1. **Pick a DB.** Postgres is the default recommendation — relational data, JSONB for flexible payloads, strong constraints.
2. **Create tables that mirror the schemas.** One table per section, plus a `sections` table for `site-config`. Keep a `visible boolean not null` column on every row.
3. **Seed from existing JSON.** Run a one-off script that reads `src/data/*.json` and inserts rows.
4. **Build a thin server layer.** A few `createServerFn` reads under `src/lib/content.functions.ts`, each returning Zod-parsed payloads.
5. **Write a `dbContentSource`** that calls those functions.
6. **Swap `contentSource`.** Done.

### Impact on frontend

Effectively zero. The page still imports `projects` and calls `visibleOnly(projects.items)`. Only the implementation under the hood changes (sync import → async fetch wrapped by SSR loader / server function).

If sections become async, add a TanStack Query `useSuspenseQuery` inside each component or — preferred — hydrate in the route loader so SSR keeps working.

---

## Schema evolution

Every JSON file may declare:

```json
{ "schemaVersion": "2.0" }
```

### Why it exists

So data written in 2026 still loads in 2046 even after the schema changes. The version is a contract between data and code.

### How future migrations work

`src/data/migrate.ts` exposes:

```ts
export const CURRENT_SCHEMA_VERSION = "2.0";
export function migrate(raw, target = CURRENT_SCHEMA_VERSION): unknown;
```

A migration step is registered keyed by the **old** version:

```ts
const MIGRATIONS: Record<string, { to: string; run: (input: unknown) => unknown }> = {
  "2.0": {
    to: "3.0",
    run: (data) => {
      const d = data as { items: Array<{ tags?: string[] }> };
      return {
        ...d,
        schemaVersion: "3.0",
        items: d.items.map((i) => ({ ...i, tags: i.tags ?? [] })),
      };
    },
  },
};
```

`migrate()` walks the chain (`1.0 → 2.0 → 3.0 → …`) and throws on unknown versions or cycles.

### How to upgrade old data

Two options:

1. **In place** — run a one-off Node script that loads each JSON, calls `migrate()`, writes it back. Commit the result.
2. **At load time** — call `migrate(raw)` inside `load()` in `content.ts` before `schema.parse()`. Best for CMS/DB origins where you can't easily rewrite all rows.

### Worked migration example

Renaming `duration` → `dates`:

```ts
"2.0": {
  to: "3.0",
  run: (data) => {
    const d = data as { items: Array<{ duration?: string }> };
    return {
      ...d,
      schemaVersion: "3.0",
      items: d.items.map(({ duration, ...rest }) => ({ ...rest, dates: duration ?? "" })),
    };
  },
},
```

Bump `CURRENT_SCHEMA_VERSION` to `"3.0"`. Old files still loadable; new files write `3.0`.

---

## Long-term maintenance guide

### Maintaining this portfolio for decades

Keep the contract narrow, predictable, and validated.

### Adding a new section

1. Add the Zod schema in `src/data/schema.ts` (and register it in `dataSchemas`).
2. Export a TypeScript alias from `src/data/types.ts`.
3. Add the JSON file in `src/data/` (and a sibling under `public/templates/`).
4. Append an entry in `site-config.json → sections`.
5. Load + freeze in `src/services/content.ts` and extend `hasItems()` in the same file.
6. Build a `<NewSection />` under `src/components/` using `visibleOnly()`.
7. Render it in `src/routes/index.tsx` under `<SectionBoundary>`.
8. Add tests under `src/data/__tests__/` and `src/services/__tests__/`.

### Adding a new JSON file

Same as above, minimum: schema + registration + file + load + render + test.

### Updating schemas

- **Additive change** (new optional field) — safe, no migration needed.
- **Renames / required additions / removals** — bump `CURRENT_SCHEMA_VERSION`, write a migration step, and update existing JSON.

### Deprecating fields

1. Mark the field optional in the schema with a `// @deprecated since 3.0` comment.
2. Stop reading it in components.
3. Leave it in place for at least one schema version, then remove + migrate.

### Archiving old data

Move retired JSON to `src/data/archive/<year>/`. Don't import it. Keep it under git for history.

### Preserving backward compatibility

- Never remove a field in the same version that adds its replacement — do it in two steps.
- Never reuse a removed field's name with a different shape.
- Keep `visible` and `featured` semantics stable forever — they're part of the public contract.

---

## Resume management

### Replacing the current resume

1. Drop the new PDF into `public/`.
2. Update `profile.json → resumeUrl` to its `/`-rooted path.

### Maintaining an archive

`site-config.json → resumeArchive[]`:

```jsonc
"resumeArchive": [
  { "year": 2030, "label": "Resume 2030", "url": "/resumes/resume_2030.pdf", "visible": true },
  { "year": 2028, "label": "Resume 2028", "url": "/resumes/resume_2028.pdf", "visible": true },
  { "year": 2026, "label": "Resume 2026", "url": "/resumes/resume_2026.pdf", "visible": false }
]
```

The `<ResumeArchive />` component reads this and auto-hides when empty.

### Recommended naming convention

```
public/resumes/
├── resume_2026.pdf
├── resume_2028.pdf
└── resume_2030.pdf
```

- Lowercase, underscore-separated, year suffix.
- One file per "version of you" — typically yearly or per major role change.
- Never overwrite an archived file. Add a new one and toggle visibility.

---

## Backup strategy

The portfolio is fully contained in git. Multiple independent copies = durable.

| Layer | What | How |
| --- | --- | --- |
| Primary | GitHub | `origin` remote. |
| Mirror | GitLab / Codeberg / Bitbucket | Add a second remote, push on every release. |
| Local | External SSD / NAS | Periodic `git clone --mirror` or filesystem snapshot. |
| Cloud | Restic / rclone → S3 / B2 / GDrive | Encrypted, scheduled. |
| Cold | Annual export | Zip of `src/data/` + `public/resumes/` to long-term cold storage. |

### Recovery

1. Clone from any mirror — `git clone <remote>`.
2. `bun install && bun run dev` — instantly running.
3. If only `src/data/` is needed (e.g. into a new framework), copy it as a folder; the JSON contract is portable.

---

## Architecture Decision Records

ADRs live under `docs/adr/`. Each is short, dated, and immutable — supersede instead of editing.

- [ADR-0001 — JSON as the content source](docs/adr/0001-json-as-content-source.md)
- [ADR-0002 — TypeScript (strict)](docs/adr/0002-typescript-strict.md)
- [ADR-0003 — Zod for runtime validation](docs/adr/0003-zod-runtime-validation.md)
- [ADR-0004 — Content abstraction (`content-source.ts`)](docs/adr/0004-content-abstraction.md)
- [ADR-0005 — Visibility flags everywhere](docs/adr/0005-visibility-flags.md)
- [ADR-0006 — Schema versioning + migrations](docs/adr/0006-schema-versioning.md)
- [ADR-0007 — Section error boundaries](docs/adr/0007-section-error-boundaries.md)
- [ADR-0008 — TanStack Start over CRA/Next](docs/adr/0008-tanstack-start.md)

---

## Future expansion roadmap

All of the following sections are **already supported** by the schema + service + auto-hide pipeline — they ship hidden by default and just need data:

- Publications · Talks · Open Source · Awards · Blog · Startups · Products · Patents · Mentoring · Media · Testimonials · Timeline

To enable any of them:

1. Set `visible: true` in `site-config.json → sections`.
2. Set `visible: true` in the data file and add at least one visible item.

No new schemas, components, or routes required.

### Out-of-band ideas (still no architectural redesign needed)

- **Markdown blog posts** — add `bodyMarkdown?: string` to `blogSchema`, render with a markdown component. Existing external-link posts keep working.
- **Multi-language** — wrap text fields with `LocalizedString = { en: string; es?: string; … }`. Migrate via `schemaVersion` bump.
- **Image gallery** — new `gallery.json` section following the same recipe in [Adding a new section](#adding-a-new-section).

---

## Developer onboarding

> You just inherited this project. You have never seen it before. Here is everything.

### How data flows

1. JSON files in `src/data/` are imported by `src/services/content.ts`.
2. Each file is validated by its Zod schema (`src/data/schema.ts`), then frozen.
3. Components import the named export (`projects`, `publications`, …) or call `visibleOnly()`/`featuredOnly()`/`isSectionRenderable()`/`autoStats()`.
4. The home route (`src/routes/index.tsx`) iterates `visibleNavSections()` and renders each section inside a `<SectionBoundary>`.

### How sections are rendered

```
<Section id="projects">
  <h2>Projects</h2>
  {visibleOnly(projects.items).map(p => <ProjectCard …/>)}
</Section>
```

If `isSectionRenderable("projects")` returns `false`, the section + nav link disappear together.

### How to add a new section

See [Adding a new section](#adding-a-new-section). It's an 8-step recipe and never requires touching a sibling component.

### How to add a new content source

1. Implement `ContentSource` in `src/services/content-source.ts`.
2. Validate every payload through the existing `dataSchemas` registry.
3. Reassign `contentSource = yourSource`.

### How to replace JSON with a CMS

See [Future CMS migration guide](#future-cms-migration-guide).

### How to replace JSON with APIs

See [Future API migration guide](#future-api-migration-guide).

### Files worth reading first

1. `src/data/schema.ts` — the contract.
2. `src/services/content.ts` — the chokepoint.
3. `src/services/content-source.ts` — the swap point.
4. `src/routes/index.tsx` — the renderer.
5. `src/components/SectionBoundary.tsx` — the safety net.
6. `docs/adr/*` — why things are the way they are.

---

## Tests

Vitest + React Testing Library + jsdom. The suite protects the architectural
rules of the portfolio (visibility, navigation, schemas, search, migrations)
so future edits cannot silently break them.

### Testing

```
tests/
├── unit/         # pure functions — visibleOnly, featuredOnly, autoStats
├── integration/  # JSON → content service → UI end-to-end flows
├── schemas/      # Zod schema validation for every JSON shape
├── content/      # content loading, filtering, and featured-item logic
├── navigation/   # menu generation, Nav component, mobile/desktop parity
├── visibility/   # site-config + per-item visibility → render decisions
├── search/       # SearchPalette indexing and keyboard interaction
├── migrations/   # schemaVersion round-trips and upgrade paths
├── fixtures/     # canonical JSON inputs (valid, invalid, empty)
└── helpers/      # shared utilities (render wrapper, readFixture, …)
```

| Folder | Purpose |
| --- | --- |
| `unit/` | Pure utility functions with no React or DOM dependency. Fast. Deterministic. |
| `integration/` | Multi-layer flows: raw JSON → Zod validation → content service → rendered React component. Catches breakage at the seams. |
| `schemas/` | Every Zod schema is exercised against valid and invalid fixtures. New fields require new schema tests. |
| `content/` | Tests `visibleOnly()`, `featuredOnly()`, `autoStats()`, and the loader helpers that decide what reaches the UI. |
| `navigation/` | The hamburger menu, IntersectionObserver section tracking, dynamic generation from `site-config.json`, and desktop/mobile parity. |
| `visibility/` | `isSectionRenderable()` and `visibleNavSections()` — the core contract that decides what appears on the page. |
| `search/` | `SearchPalette` keyboard navigation, ESC-to-close, and search-index correctness (only visible items indexed). |
| `migrations/` | `migrate.ts` — if you bump `schemaVersion`, these tests prove old data round-trips to the new shape without loss. |
| `fixtures/` | Reusable JSON payloads. Never duplicate JSON inline in a test; import a fixture. |
| `helpers/` | `render.tsx` wraps React Testing Library with providers. `content.ts` reads fixtures from disk. |

Tests inside `src/**/__tests__/` are still picked up; they remain as
white-box tests next to the code they cover.

### Running Tests

```bash
bun run test            # one-off run (CI mode)
bun run test:watch      # interactive watch mode
bun run test:coverage   # V8 coverage → coverage/index.html + lcov + text summary
bun run test:ui         # Vitest UI in browser (http://localhost:51204/__vitest__/)
```

**Expected outputs:**

- `bun run test` — green checkmarks for all suites, exit code `0`.
- `bun run test:coverage` — terminal table of per-file percentages + HTML report written to `coverage/index.html` + JUnit XML written to `test-results/junit.xml`.
- `bun run test:ui` — browser UI with per-test timing, filtering, and coverage overlay.

### Coverage Requirements

Enforced by CI in `vitest.config.ts`:

| Metric | Minimum |
| --- | --- |
| Statements | 90 % |
| Branches | 85 % |
| Functions | 90 % |
| Lines | 90 % |

If any metric falls below its threshold, the run fails with:

```
ERROR: Coverage for lines (X%) does not meet global threshold (90%)
```

This is deliberate. Thresholds guarantee that architectural code (content services,
schema validation, navigation logic, visibility system) remains tested as the
codebase grows. Thin presentation components (`Hero`, `About`, `Experience`)
are implicitly covered by integration tests; add dedicated component tests when
they gain conditional logic.

### CI/CD

`.github/workflows/ci.yml` triggers on every `push` to any branch and every `pull_request`:

```yaml
- bun install --frozen-lockfile
- bun run typecheck   # TypeScript --noEmit
- bun run lint        # ESLint
- bun run test:coverage
- bun run build       # production build
```

Any step failure blocks the merge.

### Coverage Reports

**Local:**

```bash
bun run test:coverage
open coverage/index.html
```

The HTML report shows per-file/per-line coverage. Red lines are untested; green are hit.

**CI artifacts:**

Download from the GitHub Actions run → **Artifacts** section:

| Artifact | Path | Contents |
| --- | --- | --- |
| `coverage-html` | `coverage/` | Full V8 HTML coverage report. Open `index.html` locally. |
| `test-results` | `test-results/` | JUnit XML (`junit.xml`) for test-result parsing in PR review tools. |

Both artifacts upload with `if: always()` — they are available even when tests fail.
Retention: **30 days**.

**Inspecting coverage drops:**

1. Open the latest PR → Checks tab → CI run.
2. Download `coverage-html` artifact.
3. Open `index.html` → navigate to the file with reduced coverage → red lines show the gap.
4. Add a test targeting the uncovered branch or statement.

**Inspecting failed tests:**

1. Download `test-results` artifact.
2. Open `junit.xml` in an XML viewer or IDE JUnit plugin.
3. Stack traces and assertion diffs are included inline.

### Navigation Regression Protection

The navigation hamburger menu is generated dynamically from `site-config.json`.
Tests verify that:

- **Visible sections appear** — every section with `visible: true` and `isSectionRenderable() === true` renders a menu item.
- **Hidden sections disappear** — toggling `visible: false` removes the item from both the menu and the page.
- **Auto-hide logic** — a section with zero visible items is automatically excluded from the menu and page.
- **Dynamic menu generation** — adding a new section to `site-config.json` without code changes produces a new menu item.
- **Desktop/mobile parity** — the same `Sheet` component and `visibleNavSections()` list drive both viewports.

### Schema Validation

Every JSON content file is validated through Zod schemas at import time.

Example — valid visibility field:

```json
{
  "visible": true
}
```

**Missing required fields fail CI.** The schema suite (`tests/schemas/`) asserts:

- Valid fixtures parse successfully.
- Invalid fixtures (missing required fields, wrong types, extra unknown keys) throw `ZodError`.
- Every file in `src/data/` conforms to its schema at load time.

### Migration Testing

All content files declare a `schemaVersion`:

```json
{
  "schemaVersion": "2.0"
}
```

If you bump the version and add a migration in `src/data/migrate.ts`, the
migration test suite proves:

- `v1.0` data upgrades to `v2.0` with all fields preserved.
- `v2.0` data round-trips through the identity path unchanged.
- No data is lost during migration.

This is critical for long-term maintenance: you can evolve schemas without
breaking existing content.

### How to Add a New Section (with tests)

1. **Create JSON file** — `src/data/<section>.json` with `schemaVersion`, `visible`, and items.
2. **Create schema** — add `<section>Schema` to `src/data/schema.ts` and wire it into `dataSchemas`.
3. **Add section config** — register the section in `src/data/site-config.json` with `id`, `label`, `visible`.
4. **Add tests** —
   - `tests/schemas/<section>.test.ts` — valid/invalid fixture parsing.
   - `tests/visibility/<section>-visibility.test.ts` — `visible: true/false` behavior.
   - `tests/navigation/<section>-menu.test.ts` — menu presence/absence.
5. **Verify coverage** — run `bun run test:coverage` and ensure thresholds pass.
6. **Open PR** — CI will validate the schema, the menu, and the coverage.

### Future CMS/API Migration

The portfolio is built on three abstraction layers that make migration trivial:

```
UI Components
      ↓
Content Service  (src/services/content.ts)
      ↓
Content Provider (src/services/content-source.ts)
      ↓
JSON Source      (src/data/*.json)
```

**Replacing JSON with a CMS:**

1. Implement a `ContentSource` that fetches from the CMS.
2. Validate every payload through the existing `dataSchemas` registry.
3. Reassign `contentSource = cmsSource`.

The UI never changes.

**Replacing JSON with a REST API or GraphQL:**

Same steps — write an adapter that maps the external shape to the internal
schema, validate with Zod, and swap the source. The navigation, search,
visibility, and section rendering logic remain untouched.

**Replacing JSON with a database:**

Write a `ContentSource` that queries the database, normalizes rows into the
schema shapes, and passes them through `z.parse()`. The rest of the app is
oblivious.

### Architecture Stability Guarantees

The following are protected by automated tests. A PR that breaks any of these
will fail CI:

| Guarantee | Protected By |
| --- | --- |
| **Visibility logic** | `tests/visibility/` — `visible: false` removes items; empty sections auto-hide. |
| **Navigation generation** | `tests/navigation/` — menu items match `visibleNavSections()` exactly. |
| **Content loading** | `tests/content/` — `visibleOnly()`, `featuredOnly()`, `autoStats()` correctness. |
| **Search** | `tests/search/` — only visible items indexed; keyboard navigation works. |
| **Schema validation** | `tests/schemas/` + `src/data/__tests__/` — every JSON file is valid Zod. |
| **Migration logic** | `tests/migrations/` — `schemaVersion` upgrades are lossless. |

---

### Filtering

```bash
bunx vitest run tests/schemas
bunx vitest run -t "visibleOnly"
```


---

## Notes

- All sections live on a single route (`/`) — fast load, smooth scroll, hash-deep-linkable (`/#projects`).
- Animations: Tailwind utilities + `IntersectionObserver` fade-in (`src/hooks/use-in-view.ts`).
- The dev-time JSON validator is in `plugins/data-schema-validator.ts`.

---

## Competitive Programming

A dedicated section for competitive-programming profiles. Like every other
section, it is 100% JSON-driven — no UI changes needed to add a platform,
hide one, or surface new metrics.

### Data location

```
src/data/competitive-programming.json
```

Validated by `competitiveProgrammingSchema` in `src/data/schema.ts`.
A blank, schema-valid starter file lives at
`public/templates/competitive-programming.json`.

### File shape

```json
{
  "schemaVersion": "2.0",
  "visible": true,
  "title": "Competitive Programming",
  "subtitle": "Algorithmic depth and problem-solving beyond frameworks.",
  "platforms": [
    {
      "platform": "LeetCode",
      "visible": true,
      "featured": true,
      "profileUrl": "https://leetcode.com/your-handle",
      "rating": 1797,
      "rank": "Top 10%",
      "problemsSolved": 700,
      "problemsSolvedLabel": "700+",
      "easySolved": 320,
      "mediumSolved": 310,
      "hardSolved": 70,
      "badges": 4,
      "contestAttended": 18,
      "globalRank": 28000,
      "peakRating": 1820,
      "maxRank": "Top 8%",
      "countryRank": 4200,
      "streak": 180,
      "lastUpdated": "2026-06-08",
      "peakContest": "Weekly Contest 438",
      "peakContestRank": 1188
    }
  ]
}
```

Every metric is **optional/nullable**. Cards auto-hide any field that is
`null` or empty — `"problemsSolved": null` simply doesn't render a "Problems
Solved" stat.

### Adding a platform

Append an entry:

```json
{
  "platform": "Codeforces",
  "visible": true,
  "rating": 1500
}
```

That's the minimum. Add more fields as you have data.

### Hiding a platform

Flip one flag — history is preserved:

```json
{ "platform": "AtCoder", "visible": false }
```

If every platform is hidden (or the section's own `visible` is `false`), the
whole section *and its nav entry* auto-hide.

### Supported platforms (out of the box)

The starter file ships with entries for:

- LeetCode
- Codeforces
- CodeChef
- AtCoder
- HackerRank
- HackerEarth
- GeeksforGeeks

There's no allowlist — `"platform": "<anything>"` works.

### Search integration

Visible platforms are indexed by `<SearchPalette>` (⌘K / Ctrl+K) under the
kind `Competitive Programming`. Selecting a hit jumps to
`#competitive-programming` or opens `profileUrl` in a new tab.

### Auto statistics

`autoStats()` in `src/services/content.ts` computes from visible platforms:

- `cpProblemsSolved` — sum of numeric `problemsSolved` across platforms
- `cpHighestRating` — max numeric `rating`
- `cpPlatformsActive` — number of visible platforms

These are derived on render; never enter them manually.

### Future-proof fields

`peakRating`, `maxRank`, `countryRank`, `streak`, and `lastUpdated` are
accepted by the schema today and rendered automatically when populated.
Adding a brand-new metric is a 2-line change in
`competitiveProgrammingSchema` plus an optional render branch in
`src/components/CompetitiveProgramming.tsx`.

### Architecture

#### Current flow (JSON)

```text
<CompetitiveProgramming />
        │
        ▼
   contentService  (src/services/content.ts)
        │
        ▼
src/data/competitive-programming.json
```

The component only knows about `competitiveProgramming` from
`@/services/content`. It never imports JSON, fetch, or any backend SDK.

#### Future flow — public APIs

Swap the JSON adapter for one that calls the public APIs of each platform,
without changing the component:

```text
<CompetitiveProgramming />
        │
        ▼
   contentService
        │
        ├──► LeetCode GraphQL API
        ├──► Codeforces user.info / user.status
        └──► CodeChef / AtCoder scrapers or APIs
```

How:

1. Implement a new adapter in `src/services/content-source.ts` whose
   `get("competitiveProgramming")` fetches each platform, normalizes the
   payload to match `competitiveProgrammingSchema`, and runs it through the
   same `load(...)` Zod call.
2. Cache results (e.g. with TanStack Query or a server function) so the
   page stays static-fast.
3. Reassign `contentSource = httpContentSource`. UI untouched.

#### Future flow — CMS

```text
<CompetitiveProgramming />
        │
        ▼
   contentService
        │
        ▼
   Strapi / Contentful / Sanity
```

How:

1. Model a `competitive_platform` content type in the CMS with the same
   fields as the JSON schema.
2. In a new adapter, fetch the collection at build (or request) time,
   shape it into `{ visible, title, subtitle, platforms }`, and validate
   with `competitiveProgrammingSchema`.
3. Swap `contentSource`. No component, no route, no search code changes.

#### Why migrations are cheap

- The component depends on **typed values from `content.ts`**, not on the
  origin of those values.
- Every adapter funnels payloads through the **same Zod schema**, so
  contract drift is caught at the boundary.
- The **`visible` flag** is preserved across all sources — the CMS just
  becomes another way to author the same field.

See `docs/adr/0004-content-abstraction.md` for the underlying decision.
