# Learning Roadmap & Future Maintainer Guide

This portfolio is intended to be maintained for **decades**. The goal of this document is to help future maintainers — including future versions of myself — understand exactly what skills are required to maintain, extend, migrate, and troubleshoot it.

The roadmap is structured in **five levels**. Each level builds on the previous one. You do not need to learn everything to keep the site running — Level 1 alone is enough for routine content updates.

---

## Table of Contents

1. [Level 1 — Basic Maintenance](#level-1--basic-maintenance)
2. [Level 2 — Frontend Development](#level-2--frontend-development)
3. [Level 3 — Project Architecture](#level-3--project-architecture)
4. [Level 4 — Advanced Maintenance](#level-4--advanced-maintenance)
5. [Level 5 — Future Expansion](#level-5--future-expansion)
6. [How To Edit Content](#how-to-edit-content)
7. [How To Edit the README](#how-to-edit-the-readme)
8. [Suggested Learning Resources](#suggested-learning-resources)

---

## Level 1 — Basic Maintenance

**Audience:** anyone who wants to update résumé, projects, skills, or any other content. **No programming required.**

| Technology     | What it is                                                                          | Why this project uses it                                                                    | Tasks it enables                                                                     |
| -------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **HTML**       | The markup language of the web — describes structure (headings, paragraphs, links). | Every page the browser shows is HTML under the hood, even though we write React components. | Reading error messages; understanding what `<h1>`, `<a>`, `<img>` mean.              |
| **CSS**        | A styling language — colors, spacing, layout.                                       | Visual design is built on top of CSS (via Tailwind utility classes).                        | Recognising a class like `text-lg` or `bg-primary` in a component.                   |
| **JavaScript** | The programming language of the browser.                                            | React, Vite, and every dependency in `package.json` are JavaScript / TypeScript.            | Reading code without panicking; understanding `if`, arrays, `map`.                   |
| **JSON**       | A plain-text data format: keys, values, arrays, objects.                            | **All content** in this site lives in JSON files under `src/data/`.                         | Adding projects, hiding items, reordering sections — Level 1 is mostly JSON editing. |
| **Git**        | A version-control system that tracks every change to every file.                    | Every edit is committed; you can always roll back.                                          | Cloning the repo, committing changes, pulling updates.                               |
| **GitHub**     | A web platform that hosts Git repositories and runs CI/CD.                          | The repo lives on GitHub; Actions runs tests and deploys to GitHub Pages.                   | Editing files in the browser, opening PRs, watching builds.                          |
| **Markdown**   | A lightweight text format used by `README.md` and every file under `docs/`.         | All human-facing documentation is Markdown.                                                 | Editing the README; writing new docs.                                                |

### What you can do with only Level 1

- Update your résumé (`public/resume.pdf`).
- Add or remove a project (`src/data/projects.json`).
- Edit skills (`src/data/skills.json`).
- Hide a section (`src/data/site-config.json` → `"visible": false`).
- Edit the README.
- Commit and push from the GitHub web UI — CI takes care of the rest.

---

## Level 2 — Frontend Development

**Audience:** anyone who wants to modify the look & feel, add a new UI section, or build a new component.

| Technology            | Where it's used                                                   | What you need to know                                                                                |
| --------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **TypeScript**        | Every `.ts` / `.tsx` file. `tsconfig.json` enables `strict` mode. | Basic types (`string`, `number`, `boolean`, arrays, interfaces); `z.infer` from Zod schemas.         |
| **React 19**          | Every component under `src/components/`.                          | Function components, JSX, conditional rendering, lists.                                              |
| **React Components**  | One file per component (e.g. `Projects.tsx`, `Hero.tsx`).         | Composition — small components combine into larger pages.                                            |
| **Props**             | How a parent passes data to a child.                              | Typed via interfaces; never `any`.                                                                   |
| **State**             | Local UI state via `useState`.                                    | Used sparingly — content is static; state is mostly for menus, modals, search input.                 |
| **Hooks**             | `useEffect`, `useMemo`, plus project hooks under `src/hooks/`.    | Rules of Hooks (top level, same order, in components only).                                          |
| **Tailwind CSS v4**   | All styling. Tokens defined in `src/styles.css`.                  | Utility classes; **never** hard-code colors — use semantic tokens (`bg-primary`, `text-foreground`). |
| **Responsive Design** | Tailwind breakpoints (`sm:`, `md:`, `lg:`).                       | Mobile-first — design for small screens first, then enhance.                                         |
| **Accessibility**     | Semantic HTML, ARIA labels, focus management, contrast.           | WCAG 2.2 AA target — see [`docs/design-system.md`](./design-system.md).                              |

### Common Level 2 tasks

- **Add a new section** — create `src/components/MySection.tsx`, register it in `src/data/site-config.json`, render it in the page layout.
- **Update navigation** — usually no code change; nav is generated from `site-config.json` (see [navigation flow](./architecture/navigation-flow.md)).
- **Create a new card component** — copy an existing one (e.g. `Projects.tsx`), keep semantic tokens, keep it presentational (no business logic).

---

## Level 3 — Project Architecture

**Audience:** maintainers extending the system itself — adding new content types, changing how content flows, modifying search.

| Technology / Concept           | Purpose                                                                                                                                       |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vite 7**                     | Dev server + production bundler. Fast HMR. Config in `vite.config.ts`.                                                                        |
| **TanStack Start**             | The framework around React: file-based routing, server functions, SSR-friendly.                                                               |
| **Routing**                    | Files in `src/routes/` define URLs. `__root.tsx` is the shell; `index.tsx` is the homepage.                                                   |
| **Search Architecture**        | `SearchPalette.tsx` indexes content from the content service. See [search flow](./architecture/search-flow.md).                               |
| **Theme System**               | `use-theme.ts` + CSS variables in `styles.css`. Dark by default. See [theme flow](./architecture/theme-flow.md).                              |
| **Content Service**            | `src/services/content.ts` — the **only** module the rest of the app uses to read data.                                                        |
| **Visibility Logic**           | `visibleOnly`, `featuredOnly`, `isSectionRenderable` in `content.ts`. See [visibility flow](./architecture/visibility-flow.md).               |
| **Content Source Abstraction** | `src/services/content-source.ts` — the seam that lets us swap JSON for a CMS/API/DB later. See [ADR-0004](./adr/0004-content-abstraction.md). |

### How content flows

1. JSON files in `src/data/` are imported at build time.
2. `content.ts` validates each file with its Zod schema and freezes the result.
3. Components import typed objects (`projects`, `profile`, …) from `content.ts`.
4. Helpers (`visibleOnly`, `featuredOnly`) filter hidden / archived items.
5. `site-config.json` controls which sections appear and in what order.
6. `SearchPalette` reads the same objects to build its index.

See also: [content flow](./architecture/content-flow.md), [rendering flow](./architecture/rendering-flow.md).

---

## Level 4 — Advanced Maintenance

**Audience:** maintainers protecting the long-term health of the codebase.

| Technology                | Why it exists                                            | How it protects the project                                                                                                                         |
| ------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Zod**                   | Runtime schema validation.                               | Invalid JSON fails the build with a precise field path — bad data can never reach production. See [ADR-0003](./adr/0003-zod-runtime-validation.md). |
| **Schema Validation**     | Build-time check via `plugins/data-schema-validator.ts`. | Every JSON save is re-validated; mistakes surface instantly.                                                                                        |
| **Testing**               | Multi-layer test suite under `tests/`.                   | Schemas, visibility, navigation, search, content all covered.                                                                                       |
| **Vitest**                | Test runner.                                             | Fast, Vite-native; `bun run test`, `bun run test:watch`, `bun run test:coverage`.                                                                   |
| **React Testing Library** | Component tests focused on user-visible behavior.        | Prevents UI regressions when refactoring.                                                                                                           |
| **GitHub Actions**        | CI/CD platform. Workflows in `.github/workflows/`.       | Runs typecheck, lint, tests, and coverage on every push.                                                                                            |
| **CI/CD**                 | Continuous integration & deployment.                     | Broken code never reaches the deployed site.                                                                                                        |
| **Coverage Reports**      | Uploaded as workflow artifacts.                          | Lets you spot untested files before they cause regressions.                                                                                         |

### Adding a new test

1. Decide the level: schema, unit, integration, or component.
2. Place the file under the matching `tests/` subfolder.
3. Mirror an existing file's shape.
4. Run `bun run test` locally; commit when green.

---

## Level 5 — Future Expansion

**Audience:** maintainers considering migrating off the current static-JSON model.

| Technology                                                       | When it becomes useful                                   | How the current architecture supports it                                                                                               |
| ---------------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **CMS** (Strapi, Sanity, Contentful)                             | Non-developers need a UI to edit content.                | Swap `jsonContentSource` for a CMS adapter — components untouched. See [future-cms-migration](./architecture/future-cms-migration.md). |
| **REST APIs**                                                    | Content must come from a server (multi-author, dynamic). | Adapter fetches at build or request time; Zod re-validates. See [future-api-migration](./architecture/future-api-migration.md).        |
| **GraphQL**                                                      | Multiple clients need shaped queries.                    | Same adapter seam; replace the fetch layer with a typed GraphQL client.                                                                |
| **Databases** (Postgres, SQLite)                                 | Persistent reads/writes, comments, analytics.            | See [future-database-migration](./architecture/future-database-migration.md).                                                          |
| **Static Site Hosting** (GitHub Pages, Vercel, Netlify, S3, VPS) | Already supported today — `dist/` is fully static.       | Pick any provider; see the Hosting & Deployment guide in the README.                                                                   |
| **AI Assistants**                                                | Smart search, summarization, content drafting.           | See [`docs/future-ai.md`](./future-ai.md).                                                                                             |

The single thing that makes all of these migrations cheap is the **content-source abstraction** ([ADR-0004](./adr/0004-content-abstraction.md)). Keep it intact.

---

## How To Edit Content

All content lives under `src/data/`. Edit the JSON, commit, push — CI deploys.

### Add a project

Edit `src/data/projects.json`:

```json
{
  "id": "my-new-project",
  "title": "My New Project",
  "summary": "One sentence about it.",
  "tech": ["TypeScript", "React"],
  "links": { "demo": "https://example.com" },
  "visible": true
}
```

### Add a publication

Edit `src/data/publications.json`:

```json
{ "title": "...", "venue": "...", "year": 2026, "url": "...", "visible": true }
```

### Add a certification

Edit `src/data/certifications.json`:

```json
{ "name": "...", "issuer": "...", "year": 2026, "url": "...", "visible": true }
```

### Add a competitive programming achievement

Edit `src/data/competitive-programming.json` — add to `platforms[]` or update an existing platform's `problemsSolved` / `rating`.

### Hide an item

Set:

```json
{ "visible": false }
```

The item stays in the file (and in git history) but disappears from the site.

### Reorder items

Move the JSON objects up or down within the array — order in the file is the order on the page.

### Reorder sections

Edit `src/data/site-config.json`. Reorder the `sections` array, or change each entry's `order` number.

### Hide a whole section

In `site-config.json`, set the section's `"visible": false`.

### Replace your résumé

Drop the new PDF into `public/` as `resume.pdf`.

See also: [Content Editor Guide](./content-editor-guide.md).

---

## How To Edit the README

`README.md` (and every `docs/*.md` file) is written in **Markdown** — plain text with a few formatting characters.

### Headings

```markdown
# Title

## Subtitle

### Smaller subtitle
```

### Lists

```markdown
- Item
- Item
  - Nested item
```

Ordered:

```markdown
1. First
2. Second
```

### Links

```markdown
[Architecture](docs/architecture/README.md)
[External](https://example.com)
```

### Code blocks

Inline: `` `bun run build` ``

Block:

````markdown
```bash
bun run build
bun run test
```
````

### Emphasis

```markdown
**bold** _italic_ ~~strikethrough~~
```

### Tables

```markdown
| Column A | Column B |
| -------- | -------- |
| Cell 1   | Cell 2   |
```

### Images

```markdown
![Alt text](./path/to/image.png)
```

### After editing

1. Save the file.
2. Commit and push (or use the GitHub web editor's **Commit changes** button).
3. CI verifies the build. Markdown changes never break the site.

---

## Suggested Learning Resources

Use whichever resources are current when you're reading this — the names below are stable references, but URLs change.

- **HTML / CSS / JS** — MDN Web Docs (`developer.mozilla.org`).
- **JSON** — `json.org`.
- **Git & GitHub** — Pro Git book; GitHub Docs.
- **Markdown** — CommonMark spec; GitHub Flavored Markdown spec.
- **TypeScript** — the official handbook.
- **React** — the official React docs (`react.dev`).
- **Tailwind CSS** — Tailwind docs.
- **Accessibility** — WCAG 2.2 quick reference; WebAIM.
- **Vite** — `vitejs.dev`.
- **TanStack Start / Router / Query** — `tanstack.com`.
- **Zod** — `zod.dev`.
- **Vitest** — `vitest.dev`.
- **React Testing Library** — `testing-library.com`.
- **GitHub Actions** — GitHub Docs → Actions.

---

## Summary

| Goal                             | Minimum level required |
| -------------------------------- | ---------------------- |
| Update résumé, projects, skills  | Level 1                |
| Edit the README or docs          | Level 1                |
| Change UI / add a section        | Level 2                |
| Add a new content type           | Level 3                |
| Modify validation, tests, or CI  | Level 4                |
| Migrate off JSON to a CMS/API/DB | Level 5                |

Keep this document up to date as the stack evolves. If a technology is removed or replaced, update the relevant level and link to the ADR that records the decision.
