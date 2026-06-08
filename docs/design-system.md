# Design System

Visual consistency over decades requires that every component pulls from a small set of tokens, never from raw values.

## Tokens

Defined as CSS variables in `src/styles.css`. Use Tailwind utility classes that reference these tokens; never hardcode colors or sizes in components.

### Colors (semantic)

| Token | Purpose |
|---|---|
| `--background` | Page background |
| `--foreground` | Default text |
| `--primary` / `--primary-foreground` | Primary action |
| `--secondary` / `--secondary-foreground` | Secondary surfaces |
| `--muted` / `--muted-foreground` | De-emphasized text/surfaces |
| `--accent` / `--accent-foreground` | Accent highlights |
| `--destructive` / `--destructive-foreground` | Errors and destructive actions |
| `--border`, `--input`, `--ring` | Form/UI structure |

Both light and dark themes define values for every token. Components must work in both.

## Typography

- **Display / headings**: chosen distinctive font (avoid Inter/Poppins defaults).
- **Body**: refined sans-serif paired with the display font.
- **Mono**: for code, IDs, tabular data.
- Sizes: use Tailwind's `text-*` scale; do not introduce arbitrary sizes.
- Line-height: rely on Tailwind defaults; override only when needed for display type.

## Spacing

Tailwind's 4px base scale (`p-2`, `p-4`, `p-6`, etc.). Avoid one-off pixel values.

## Breakpoints

| Name | Min width |
|---|---|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

Mobile-first: write base styles for mobile, layer breakpoint utilities upward.

## Animations

- `framer-motion` for orchestrated motion.
- Respect `prefers-reduced-motion` — wrap meaningful motion in a guard.
- Durations: 150–300ms for UI, 400–600ms for hero/page transitions.
- Easing: prefer `easeOut` / `easeInOut`.

## Components

- Base components live in `src/components/ui/` (shadcn-style).
- Domain components live in `src/components/<section>/`.
- Always extend with `cva` variants rather than copy-paste.

## Accessibility Standards

- WCAG 2.2 AA minimum.
- Color contrast checked in both themes.
- All interactive elements keyboard-reachable.
- `aria-*` attributes on custom controls.
- Visible focus rings (`--ring`).
- Skip-to-content link in the header.
- Form fields have labels; errors announced via `aria-live`.
- Images have meaningful `alt` text (see [Image Management](./image-management.md)).

## Adding a New Component

1. Check if a base component covers it.
2. If new tokens are needed, add them to `src/styles.css` for both themes.
3. Build variants with `cva`.
4. Write a test under `tests/`.
5. Document any new pattern here.
