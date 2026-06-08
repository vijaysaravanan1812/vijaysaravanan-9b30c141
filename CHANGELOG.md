# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive documentation set under `docs/` covering architecture, data model, releases, dependencies, design system, licensing, maintenance, and future roadmap.
- `docs/architecture/` with Mermaid diagrams for current and future states.
- `public/schema/` exporting JSON Schemas from Zod definitions.
- `CHANGELOG.md`, `SECURITY.md`, `LICENSE`.
- Archive support documented (`archived: true` on content entries).

### Changed
- README updated to act as an entry point linking into `docs/`.

---

## [2.0.0] - TBD

Future major version. Reserved for breaking changes (schema rename, route restructure, content provider replacement).

### Added
- _placeholder_

### Changed
- _placeholder_

### Removed
- _placeholder_

---

## [1.1.0] - TBD

### Added
- Testing infrastructure (`tests/`), CI workflow, coverage thresholds.
- GitHub Pages deploy workflow.
- Hosting & Deployment Guide in README.

---

## [1.0.0] - Initial Release

### Added
- Portfolio scaffold with React + TanStack Start + Vite.
- JSON-driven content under `src/data/`.
- Zod schema validation.
- Visibility logic via `visible: true/false`.
- Navigation generated from `site-config.json`.
- Search palette, theme toggle, responsive design.

---

## Template for Future Releases

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New features.

### Changed
- Changes in existing functionality.

### Deprecated
- Soon-to-be removed features.

### Removed
- Removed features.

### Fixed
- Bug fixes.

### Security
- Vulnerability fixes.
```
