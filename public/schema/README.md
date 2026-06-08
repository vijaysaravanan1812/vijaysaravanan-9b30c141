# JSON Schemas

Machine-readable JSON Schema files exported from the Zod schemas in `src/data/schema.ts`. These exist so that:

- External tools (CMS editors, form generators) can validate portfolio data without running JS.
- A future API can reuse the same contracts.
- IDEs can autocomplete JSON files via `"$schema"` references.

## Usage in JSON files

Add a `$schema` property pointing at the matching schema:

```json
{
  "$schema": "/schema/projects.schema.json",
  "items": [ ... ]
}
```

## Files

- `profile.schema.json` — `profile.json`
- `projects.schema.json` — `projects.json`
- `skills.schema.json` — `skills.json`
- `site-config.schema.json` — `site-config.json`

Additional schemas may be added over time. They are regenerated whenever Zod schemas change — keep them in sync.

## Regeneration

Future: add a `bun run schemas:export` script that converts Zod → JSON Schema (e.g. via `zod-to-json-schema`) and writes the output here. Until then, the files in this directory are hand-maintained references that must stay aligned with `src/data/schema.ts`.

## Use Cases

- **CMS integration**: Strapi/Sanity/Contentful can import these to scaffold content types.
- **API validation**: a future REST/GraphQL endpoint can validate requests/responses against these.
- **Editor tooling**: VS Code reads `$schema` and provides autocomplete + inline errors for editors.
