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

## Theme

Dark by default. A sun/moon toggle in the nav switches to light. Choice is persisted in `localStorage`.

## Run locally

```bash
bun install
bun run dev
```

## Notes

- All section anchors live on a single route (`/`) — fast load, smooth scroll, hash-deep-linkable (`/#projects`).
- Animations use Tailwind utilities + an `IntersectionObserver` fade-in (`src/hooks/use-in-view.ts`).
