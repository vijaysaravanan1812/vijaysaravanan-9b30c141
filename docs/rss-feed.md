# RSS Feed Support (Future)

Status: **planned**. Not implemented.

## Goal

Expose a feed at `/feed.xml` containing the latest:

- Blog posts (`blog.json`)
- Talks (`talks.json`)
- Publications (`publications.json`)

So readers can subscribe via any RSS reader without polling the site.

## Proposed Generation

Add a server route at `src/routes/feed[.]xml.ts`:

```ts
import { createFileRoute } from "@tanstack/react-router";
import { getFeedItems } from "@/services/content/feed.functions";

export const Route = createFileRoute("/feed.xml")({
  server: {
    handlers: {
      GET: async () => {
        const items = await getFeedItems();
        const xml = renderRss(items);
        return new Response(xml, {
          headers: { "Content-Type": "application/rss+xml" },
        });
      },
    },
  },
});
```

`renderRss` builds an RSS 2.0 document from the merged, visibility-filtered, date-sorted list of blog/talk/publication entries.

## Keep It Optional

- Feature-flag in `site-config.json`:
  ```json
  { "features": { "rss": false } }
  ```
- When `false`, the route returns 404. When `true`, the feed renders.
- Link discovery: `<link rel="alternate" type="application/rss+xml" href="/feed.xml">` in `<head>` only when enabled.

## Migration Notes

- Atom 1.0 alternative trivially derives from the same data.
- JSON Feed equally straightforward.
