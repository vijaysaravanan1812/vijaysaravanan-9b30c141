# Portfolio — JSON-Driven Personal Site

Modern, dark-themed personal portfolio built with **React + TanStack Start + Tailwind v4**. All content is managed through JSON files in `src/data/` — no React code changes needed to add, remove, hide, or reorder content.

## Stack

- React 19 + TanStack Start (Vite-based)
- Tailwind CSS v4 (CSS-first design tokens)
- Lucide icons
- Fully static — no backend, no database

## Editing content

Every content file lives in `src/data/`:

```
src/data/
├── site-config.json    ← global section visibility + rotating role chips
├── profile.json        ← hero name, role, summary, stats, socials
├── about.json          ← long-form bio + "how I work" principles
├── experience.json     ← timeline entries
├── projects.json       ← project cards (problem / outcome)
├── skills.json         ← grouped skill chips
├── education.json
├── publications.json
├── certifications.json
├── achievements.json
└── contact.json
```

### Visibility model

Every file and every item supports a `visible: true | false` flag.

- `visible: false` on an item → that card / row is not rendered, no empty space left behind.
- `visible: false` on the file's root → the entire section is hidden, including the nav link.
- A section with all items hidden also hides itself automatically.

### Adding a new project

Open `src/data/projects.json` and append:

```json
{
  "visible": true,
  "title": "My New Thing",
  "tags": ["Systems"],
  "stack": ["Go", "Postgres"],
  "duration": "Jan 2026 — Mar 2026",
  "problem": "What was broken.",
  "outcome": "What you shipped, with numbers.",
  "github": "https://github.com/...",
  "demo": ""
}
```

No code changes required.

### Hiding a whole section (e.g. publications)

`src/data/publications.json`:

```json
{ "visible": false, "items": [] }
```

The "Publications" link disappears from desktop nav, mobile nav, and the page.

### Rotating role chip (top-left of the nav)

Edit `site-config.json → rotatingRoles`:

```json
"rotatingRoles": ["Backend Engineer", "Distributed Systems", "Platform Engineer"]
```

### Resume download

Drop your resume PDF into `public/` and update `profile.json → resumeUrl`.

## Updating content (JSON-only workflow)

You should **never** need to touch a `.tsx` file to add, remove, reorder, or
hide content. Every section is driven by one JSON file in `src/data/` and
validated at dev/build time by Zod (see `src/data/schema.ts`). If something
is wrong, Vite shows a friendly overlay with the exact field path.

### The golden rules

1. **Every object that can be shown or hidden has its own `visible` flag** —
   the file root *and* every item inside `items` / `stats` / `socials` /
   `categories` / `links`. Both are required booleans; omitting either is a
   build error.
2. **Order in JSON = order on the page.** Move an entry up in the `items`
   array and it moves up in the UI. No sort logic, no `order` field.
3. **Section order and nav labels are controlled by `site-config.json →
   sections`**, not by the individual data files. To rename "Work" to
   "Experience" in the nav, edit the `label` there.
4. **Save the file → the dev server hot-reloads.** No restart needed unless
   you added a brand-new file (then restart so the validator picks it up).

### Adding an item to any section

Open the corresponding file and append an object to its `items` array. The
required shape per file is documented by the Zod schema — the dev overlay
will point at any missing field. Examples:

```json
// experience.json — add a job
{
  "visible": true,
  "company": "Acme",
  "position": "Staff Engineer",
  "location": "Remote",
  "duration": "2025 — Present",
  "highlights": ["Shipped X that did Y."],
  "stack": ["Go", "Kafka"]
}
```

```json
// skills.json — add a category
{
  "visible": true,
  "name": "Databases",
  "items": ["Postgres", "Redis", "ClickHouse"]
}
```

```json
// publications.json — add a paper
{
  "visible": true,
  "title": "On Things",
  "authors": "Doe, J.",
  "venue": "ACM",
  "year": 2025,
  "doi": "10.1234/abcd",
  "link": "https://doi.org/10.1234/abcd"
}
```

### Removing an item

Either delete the object from the array, or flip `"visible": true` →
`"visible": false` to keep it around for later without rendering it.

### Hiding vs deleting an entire section

| Goal | Edit | Value |
| --- | --- | --- |
| Hide section + nav link, keep data | the section's file root | `"visible": false` |
| Hide nav link only, leave section reachable by anchor | `site-config.json → sections[id].visible` | `false` |
| Remove permanently | delete the file *and* its entry in `site-config.json → sections` | — |

A section with `visible: true` at the root but **zero visible items** also
auto-hides — the nav link disappears and no empty heading is rendered.

### Reordering sections

Reorder the objects inside `site-config.json → sections`. The nav and the
page render in that order.

### Common pitfalls with `visible` flags

- **Forgetting `visible` on a new item.** Zod treats it as required, so the
  build fails with `items.3.visible — missing required \`visible\` flag`.
  Always copy an existing item as your template.
- **Using a string, number, or `null`** (`"visible": "true"`, `"visible": 1`)
  — must be a JSON boolean: `true` or `false`, unquoted, lowercase.
- **Hiding a parent but leaving children visible.** Children are not
  rendered, but they're still validated. Keep them well-formed or remove
  them.
- **Hiding every item in a section and expecting the heading to stay.** It
  won't — empty sections auto-hide. If you want a "Coming soon" placeholder,
  keep one visible item with placeholder copy.
- **Toggling `visible` in `site-config.json → sections` but forgetting the
  data file** (or vice versa). Both must agree: the nav is visible only when
  both the section config *and* the data file say `visible: true` *and* there
  is at least one visible item.
- **Editing `site-config.json → sections[].id`.** The `id` is also the URL
  hash (`/#projects`) and the key `isSectionRenderable` switches on. Renaming
  it breaks deep links and silently disables the visibility check for that
  section. Don't rename ids unless you have to.
- **Trailing commas / unquoted keys.** JSON is strict — no comments, no
  trailing commas, all keys in double quotes. The overlay shows the parse
  error with line/column.

### Updating the resume PDF

Drop the new file into `public/` and update `profile.json → resumeUrl` to its
path (e.g. `/VijaySaravanan_Resume.pdf`).




## Theme

Dark by default. A sun/moon toggle in the nav switches to light. Choice is persisted in `localStorage`.

## Run locally

```bash
bun install
bun run dev
```

## Tests

Unit tests cover the Zod schemas in `src/data/schema.ts`, the typed loaders /
`visibleOnly` / `isSectionRenderable` / `visibleNavSections` helpers in
`src/services/content.ts`, and validate every real JSON file in `src/data/`.

```bash
# one-off run (CI mode)
bun run test
# or: bunx vitest run

# watch mode — re-runs on file change
bun run test:watch
# or: bunx vitest

# browser UI (opens http://localhost:51204/__vitest__/)
bun run test:ui

# coverage report (text + HTML in ./coverage/index.html)
bun run test:coverage
```

Coverage uses Vitest's V8 provider. First run will prompt to install
`@vitest/coverage-v8` — accept, or pre-install with
`bun add -d @vitest/coverage-v8`.

Run a single file or filter by name:

```bash
bunx vitest run src/data/__tests__/schema.test.ts
bunx vitest run -t "visibleOnly"
```

## Notes

- All section anchors live on a single route (`/`) — fast load, smooth scroll, hash-deep-linkable (`/#projects`).
- Animations use Tailwind utilities + an `IntersectionObserver` fade-in (`src/hooks/use-in-view.ts`).

