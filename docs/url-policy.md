# URL Stability Policy

URLs are a contract with the public web. They appear in resumes, search engines, citations, and inbound links. Once published, they should never break.

## Current URL Patterns

Single-page app with hash anchors for sections:

```
/                    # Home
/#about              # About section
/#experience         # Experience
/#projects           # Projects
/#skills             # Skills
/#publications       # Publications
/#contact            # Contact
```

Plus any standalone route under `src/routes/`.

## Rules

1. **Never rename a section `id`** in `site-config.json` without a redirect.
2. **Never delete a route** without a redirect.
3. **Hash anchors are case-sensitive** — keep them lowercase, kebab-case.
4. **Public file paths** (`/resume.pdf`, `/images/...`) are URLs too. Don't rename without leaving the old file in place or redirecting.

## When a Change Is Necessary

1. Add a redirect (host-level or via a client-side handler) from the old URL to the new one.
2. Update internal links.
3. Note the change in `CHANGELOG.md` as a BREAKING change unless a redirect is in place.
4. Keep the redirect indefinitely.

## Deep Linking

Hash anchors scroll to the matching section on load. Section IDs in `site-config.json` must match the DOM `id` rendered by each section component.

## Checklist Before Changing a URL

- [ ] Search the codebase for the old URL.
- [ ] Search published content (resume, social profiles) for the old URL.
- [ ] Add a redirect.
- [ ] Update sitemap.
- [ ] Update internal links.
- [ ] Note in CHANGELOG.
