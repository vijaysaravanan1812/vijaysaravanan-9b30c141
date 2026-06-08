# Yearly Maintenance Guide

Pick one date each year (e.g. birthday, January 1). Block 2–3 hours. Run this checklist.

## Content

- [ ] Update resume PDF (`public/resume.pdf`).
- [ ] Add new roles to `experience.json`.
- [ ] Add new projects to `projects.json`.
- [ ] Add new publications to `publications.json`.
- [ ] Add new certifications to `certifications.json`.
- [ ] Add new talks to `talks.json`.
- [ ] Add new awards to `awards.json`.
- [ ] Update bio in `about.json` and headline in `profile.json`.
- [ ] Archive projects that are no longer active.

## Links Verification

- [ ] Every social link in `profile.json` resolves.
- [ ] Every project demo / repo link resolves.
- [ ] Every publication URL resolves.
- [ ] Every talk slides / video link resolves.

Tooling: a link-check script (e.g. `lychee`) over the JSON and rendered HTML.

## Operational

- [ ] Domain renewal confirmed (auto-renew on).
- [ ] DNS records still correct.
- [ ] SSL certificate valid.
- [ ] Hosting provider account in good standing.
- [ ] Backups present and restorable.

## Code Health

- [ ] `bun update`; run `typecheck`, `lint`, `test`, `build`.
- [ ] Review and merge Dependabot PRs.
- [ ] Check Node / Bun versions still supported.
- [ ] Re-run full test suite; ensure coverage thresholds still met.

## SEO & Analytics

- [ ] `sitemap.xml` lists all current routes.
- [ ] `robots.txt` correct.
- [ ] OG / Twitter meta tags accurate per route.
- [ ] Lighthouse score check (Performance, Accessibility, SEO, Best Practices).
- [ ] Review analytics for top pages and bounce rate.

## Archive Review

- [ ] Review `archived: true` entries; promote any worth resurfacing, prune any truly obsolete.

## Documentation

- [ ] `CHANGELOG.md` reflects the year's changes.
- [ ] `docs/data-model.md` matches actual schemas.
- [ ] `docs/dependencies.md` reflects current major versions.

## Sign-off

- [ ] Commit with message `chore: yearly maintenance YYYY`.
- [ ] Tag release if anything material changed.
