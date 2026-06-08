# Data Model

All content lives in `src/data/*.json` and is validated by Zod schemas in `src/data/schema.ts`. Every file may use the universal flags:

| Field | Type | Purpose |
|---|---|---|
| `visible` | boolean | If `false`, entry is hidden everywhere. |
| `archived` | boolean | If `true`, entry is excluded from main views but kept for history. |
| `order` | number | Optional sort key (ascending). |

## Files

### `profile.json`
**Purpose**: Identity, headline, avatar, social links.
**Required**: `name`, `headline`.
**Optional**: `tagline`, `avatar`, `socials[]`, `location`, `email`.
**Relationships**: Referenced by header, hero, contact, SEO meta.

### `about.json`
**Purpose**: Long-form bio.
**Required**: `body` (markdown).
**Optional**: `highlights[]`.

### `experience.json`
**Purpose**: Work history.
**Fields**: `company`, `role`, `start`, `end?`, `summary`, `highlights[]`, `tech[]`, `visible`, `archived`.

### `projects.json`
**Purpose**: Portfolio projects.
**Fields**: `id`, `title`, `summary`, `description?`, `tech[]`, `links{repo?,demo?}`, `image?`, `featured?`, `visible`, `archived`.

### `skills.json`
**Purpose**: Skill groups.
**Fields**: `category`, `items[]`, `visible`.

### `education.json`
**Fields**: `school`, `degree`, `start`, `end`, `notes?`, `visible`.

### `publications.json`
**Fields**: `title`, `venue`, `year`, `url?`, `authors[]`, `visible`.

### `certifications.json`
**Fields**: `name`, `issuer`, `year`, `url?`, `visible`.

### `achievements.json`
**Fields**: `title`, `date`, `summary`, `visible`.

### `awards.json`
**Fields**: `name`, `awarder`, `year`, `summary?`, `visible`.

### `talks.json`
**Fields**: `title`, `event`, `date`, `url?`, `slides?`, `visible`, `archived`.

### `startups.json`
**Fields**: `name`, `role`, `period`, `summary`, `url?`, `visible`, `archived`.

### `products.json`
**Fields**: `name`, `summary`, `url?`, `status`, `visible`.

### `mentoring.json`
**Fields**: `program`, `period`, `summary`, `visible`.

### `patents.json`
**Fields**: `title`, `number`, `year`, `url?`, `visible`.

### `open-source.json`
**Fields**: `project`, `role`, `url`, `summary`, `visible`.

### `blog.json`
**Fields**: `title`, `date`, `url`, `summary`, `tags[]`, `visible`.

### `timeline.json`
**Purpose**: Chronological highlights for a "story" view.
**Fields**: `date`, `title`, `body`, `category`, `visible`.

### `contact.json`
**Fields**: `email?`, `phone?`, `message?`, `socials[]`.

### `seo.json`
**Fields**: `title`, `description`, `keywords[]`, `ogImage?`, `twitterHandle?`.

### `site-config.json`
**Purpose**: Navigation, section toggles, feature flags.
**Fields**: `sections[]` (with `id`, `label`, `visible`, `order`), `features{}`.

## Visibility Behavior Summary

- A section absent from `site-config.json` (or `visible: false`) is not in the nav.
- A content entry with `visible: false` never reaches the UI.
- An entry with `archived: true` is hidden from main views; archive pages may opt in.

## Example Entry (projects.json)

```json
{
  "id": "stable-slug",
  "title": "Example Project",
  "summary": "One sentence elevator pitch.",
  "tech": ["TypeScript", "React"],
  "links": { "repo": "https://github.com/user/repo" },
  "featured": true,
  "visible": true,
  "archived": false
}
```
