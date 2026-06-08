# Image Management

## Location

All images live under `public/images/`. They are served as-is at `/images/<name>`.

## Naming Conventions

- lowercase, kebab-case: `project-foo-cover.jpg`.
- Prefix by section: `project-`, `talk-`, `award-`, `avatar-`.
- Include dimensions in the filename for hero images: `hero-1920x1080.jpg`.
- No spaces, no uppercase, no accented characters.

## Compression Guidelines

| Use | Format | Target Size |
|---|---|---|
| Photo / hero | JPEG (quality 80) or WebP | ≤ 200 KB |
| Screenshot | PNG or WebP | ≤ 300 KB |
| Avatar | JPEG / WebP | ≤ 80 KB |
| Logo / icon | SVG | ≤ 20 KB |
| Favicon | ICO + PNG fallback | ≤ 10 KB |

Run images through `squoosh.app`, `imagemin`, or `cwebp` before committing.

## Supported Formats

- `webp` (preferred for photos and screenshots)
- `jpg` (fallback)
- `png` (only when transparency is required)
- `svg` (vector / icons / logos)
- `avif` (optional, modern; ensure fallback)

## Maximum File Sizes

- Single image: **500 KB hard cap**.
- Total `public/images/` directory: **soft cap 25 MB** — beyond this, consider a CDN or media host.

## Accessibility (Alt Text)

Every image rendered by a component must have meaningful `alt` text:
- Describe what the image conveys, not "image of...".
- Decorative images: `alt=""`.
- Store alt text alongside the image path in the JSON entry: `{ "image": "/images/foo.webp", "alt": "..." }`.

## Replacing Images

1. Keep the same filename if the meaning is identical (saves URL changes).
2. If renaming, leave the old file in place for one release cycle for cache safety.
3. Bust browser caches by appending a query string: `?v=2` (handled by Vite for bundled assets; manual for `public/`).
