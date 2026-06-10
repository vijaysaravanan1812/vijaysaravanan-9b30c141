# Architecture Documentation

This portfolio is a static React application backed by JSON content files. Every layer is decoupled so that future migrations (CMS, API, database) can replace the content source without touching UI components.

## Layered Architecture

```
┌────────────────────────────────────────┐
│  UI Components (src/components, routes) │  ← Presentation
├────────────────────────────────────────┤
│  Content Service (src/services/content) │  ← Domain access
├────────────────────────────────────────┤
│  Content Provider (adapter)             │  ← Pluggable source
├────────────────────────────────────────┤
│  JSON Files (src/data/*.json)           │  ← Storage (current)
└────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer            | Responsibility                                                             | Replaceable?            |
| ---------------- | -------------------------------------------------------------------------- | ----------------------- |
| UI Components    | Render data, handle interaction, accessibility. Never reads JSON directly. | No                      |
| Content Service  | Public API consumed by UI. Returns typed, filtered, visibility-aware data. | No                      |
| Content Provider | Adapter that fetches raw content (JSON today, CMS/API/DB tomorrow).        | YES — swap freely       |
| Storage          | Where the data lives.                                                      | YES — JSON → CMS/API/DB |

## Diagrams

All diagrams use [Mermaid](https://mermaid.js.org/). GitHub renders them inline.

- [Current Architecture](./current-architecture.md)
- [Content Flow](./content-flow.md)
- [Rendering Flow](./rendering-flow.md)
- [Search Flow](./search-flow.md)
- [Navigation Flow](./navigation-flow.md)
- [Visibility Flow](./visibility-flow.md)
- [Theme Flow](./theme-flow.md)
- [Future CMS Migration](./future-cms-migration.md)
- [Future API Migration](./future-api-migration.md)
- [Future Database Migration](./future-database-migration.md)
