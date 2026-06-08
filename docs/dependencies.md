# Dependency Management

## Update Workflow

Routine refresh (monthly):
```bash
bun update            # respects semver ranges
bun run typecheck
bun run lint
bun run test
bun run build
```

Major version bump:
```bash
bun add <pkg>@latest
```
Read the package's changelog, run the full suite, and commit only after a green build.

## Version Pinning

- **Runtime deps**: caret ranges (`^x.y.z`) so patches roll in.
- **Build/CI critical deps** (vite, tanstack, react): caret ranges, but only bump majors deliberately.
- **Lockfile**: `bun.lock` is committed and is the source of truth.

## Handling Breaking Changes

1. Read the package's migration guide.
2. Branch: `chore/deps-<pkg>-vX`.
3. Update one major dep at a time.
4. Run `bun run typecheck` and tests after each.
5. Note breaking changes in `CHANGELOG.md` under the next MAJOR release.

## Security Updates

- GitHub Dependabot alerts: address within 30 days; critical within 7.
- `bun pm audit` (when available) or `npm audit` against `package-lock.json` mirror.
- Patch releases ship as PATCH version bumps.

## When to Pin Exactly

Pin exact versions (no caret) when:
- A regression in the package broke production.
- A package is unstable (pre-1.0) and minor bumps have shipped breaking changes.

Document the pin reason in `CHANGELOG.md` and revisit each quarter.

## Replacing a Dependency

Always prefer:
1. Web standard APIs.
2. Pure JS / TS implementation.
3. A well-maintained package.
4. A second-tier package only if no alternative.

Never add a dependency for a one-line utility.
