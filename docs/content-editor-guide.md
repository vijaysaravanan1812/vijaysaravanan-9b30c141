# Content Editor Guide

This guide is for editing the portfolio's content without writing code. All content lives in JSON files under `src/data/`. Open them in any text editor.

> Save the file, commit, and push — the site rebuilds and deploys automatically.

## Add a Project

Open `src/data/projects.json` and add an entry:

```json
{
  "id": "my-new-project",
  "title": "My New Project",
  "summary": "One sentence about it.",
  "tech": ["TypeScript", "React"],
  "links": { "demo": "https://example.com" },
  "visible": true
}
```

## Edit a Project

Find it in `projects.json` by `id`, change any field, save.

## Hide a Project

Set `"visible": false`. It disappears from the site but stays in the file.

## Archive a Project

Set `"archived": true` to retire a project without deleting history. See [Archive Strategy](./archive-strategy.md).

## Add a Publication

Open `src/data/publications.json`:

```json
{ "title": "...", "venue": "...", "year": 2026, "url": "..." }
```

## Add a Certification

Open `src/data/certifications.json`:

```json
{ "name": "...", "issuer": "...", "year": 2026, "url": "..." }
```

## Add an Achievement

Open `src/data/achievements.json` and add the entry.

## Replace Your Resume

Drop the new PDF into `public/` as `resume.pdf`. The link in the header / contact section will pick it up.

## Add a Social Link

Edit `src/data/profile.json`:

```json
{
  "socials": [
    { "label": "GitHub", "url": "https://github.com/you" },
    { "label": "LinkedIn", "url": "https://linkedin.com/in/you" }
  ]
}
```

## Reorder Sections

Open `src/data/site-config.json`. Reorder the `sections` array, or change each entry's `order` number.

## Hide an Entire Section

In `site-config.json`, set the section's `visible` to `false`.

## Replace an Image

Place the new file in `public/images/` (see [Image Management](./image-management.md)) and update the path in the relevant JSON entry.

## After Editing

1. Save the file.
2. Commit and push (or use the GitHub web editor's "Commit changes" button).
3. CI runs tests. If green, the site deploys.

If you make a JSON syntax mistake, the build fails and the site keeps serving the previous version — nothing breaks live.
