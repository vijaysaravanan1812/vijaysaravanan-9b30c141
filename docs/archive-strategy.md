# Archive Strategy

When a project, job, talk, or startup is no longer current but is part of the story, **archive** instead of deleting.

## How to Archive

Add to the entry:

```json
{
  "visible": false,
  "archived": true
}
```

Or, to keep it visible only on an archive page:

```json
{
  "visible": true,
  "archived": true
}
```

The content service treats `archived: true` as a flag for the UI to opt in or out per view.

## What to Archive vs Delete

| Situation                                          | Action                 |
| -------------------------------------------------- | ---------------------- |
| Project taken offline but historically significant | Archive                |
| Talk given years ago, recording still online       | Archive                |
| Job at a company you worked at                     | Archive (never delete) |
| Startup that wound down                            | Archive                |
| Draft entry never published                        | Delete                 |
| Test data                                          | Delete                 |
| Duplicate entry                                    | Delete                 |

## Where Archived Content Goes

- **Main pages**: excluded.
- **Search index**: excluded by default.
- **Optional `/archive` page**: opt-in, lists archived items grouped by section.
- **Backups**: retained forever.

## Why Archive

- Preserves provenance for citations and resumes.
- Search engines retain old URLs (see [URL Stability Policy](./url-policy.md)).
- A 30-year career is easier to reconstruct from archived JSON than from git history.

## Rule of Thumb

If you might ever want to remember it, archive. If it would embarrass you in any context, delete.
