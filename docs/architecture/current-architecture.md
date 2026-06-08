# Current Architecture

```mermaid
flowchart TB
  subgraph Browser
    UI[React UI Components]
    Router[TanStack Router]
    Theme[Theme Provider]
    Search[Search Palette]
  end

  subgraph App
    CS[Content Service]
    CP[Content Provider Adapter]
    VL[Visibility Logic]
    NG[Navigation Generator]
  end

  subgraph Storage
    JSON[src/data/*.json]
    Schemas[Zod Schemas]
  end

  UI --> CS
  Router --> UI
  Theme --> UI
  Search --> CS
  CS --> VL
  CS --> CP
  CP --> JSON
  Schemas --> CP
  CS --> NG
  NG --> Router
```

**Responsibilities**

- **UI Components**: stateless rendering, accessibility, animations.
- **TanStack Router**: file-based routing under `src/routes/`.
- **Content Service**: public domain API.
- **Content Provider**: pluggable adapter for the storage backend.
- **Visibility Logic**: filters `visible: false` and `archived: true`.
- **Navigation Generator**: derives nav from `site-config.json`.
- **Zod Schemas**: validate every JSON at load time.
