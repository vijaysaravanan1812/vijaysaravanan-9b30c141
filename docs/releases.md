# Release Management

## Versioning Strategy

[Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`.

- **MAJOR** — breaking changes: schema renames, removed routes, changed public URLs, content provider replacement.
- **MINOR** — new sections, new fields (backward-compatible), new features.
- **PATCH** — bug fixes, copy edits, dependency patch bumps.

## Release Workflow

1. Ensure `main` is green: `bun run typecheck && bun run lint && bun run test`.
2. Update `CHANGELOG.md` — move `[Unreleased]` items into the new version section with the date.
3. Bump version in `package.json`.
4. Commit: `chore(release): vX.Y.Z`.
5. Tag: `git tag -a vX.Y.Z -m "vX.Y.Z"`.
6. Push: `git push && git push --tags`.
7. Create a GitHub Release from the tag, pasting the changelog section.
8. GitHub Actions deploys `dist/` to GitHub Pages automatically.

## Tagging

```bash
git tag -a v1.2.0 -m "v1.2.0"
git push origin v1.2.0
```

## GitHub Releases

- Title: `vX.Y.Z`
- Body: copy the matching section from `CHANGELOG.md`.
- Attach `dist.zip` for offline archival (optional).

## Deployment Procedure

Automatic on push to `main` via `.github/workflows/deploy-pages.yml`.

Manual:

```bash
bun install
bun run build
# upload dist/ to your host
```

## Rollback Procedure

1. Identify the last good tag: `git tag --sort=-creatordate | head`.
2. Re-deploy by re-running the deploy workflow on that tag, OR
3. Revert the bad commit: `git revert <sha>` and push.
4. Verify on the deployed URL.

## Hotfix Procedure

1. Branch from the affected tag: `git checkout -b hotfix/x.y.z vX.Y.Z`.
2. Apply the fix, add tests.
3. Bump PATCH, update `CHANGELOG.md`.
4. Tag `vX.Y.(Z+1)`, push, release.
5. Cherry-pick the fix back to `main`.
