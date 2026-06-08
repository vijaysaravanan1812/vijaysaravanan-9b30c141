# Visibility Flow

```mermaid
flowchart TB
  Entry[Content Entry] --> V{visible?}
  V -- false --> Hidden[Excluded everywhere]
  V -- true --> A{archived?}
  A -- true --> Archive[Excluded from main UI, kept in archive views]
  A -- false --> Render[Rendered normally]
```

**Rules**

- `visible: false` → not rendered, not searchable, not in nav.
- `visible: true, archived: true` → hidden from default views but retained for historical reference and optional archive pages.
- `visible: true, archived: false` (or omitted) → fully rendered.

See [Archive Strategy](../archive-strategy.md).
