# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| Latest `main` | Yes |
| Last tagged release | Yes |
| Older releases | No |

## Reporting a Vulnerability

Please **do not open public GitHub issues** for security findings.

Report privately by email to the portfolio owner (address in `src/data/profile.json` or `src/data/contact.json`). Include:

1. Description of the vulnerability.
2. Steps to reproduce.
3. Affected version / commit SHA.
4. Suggested fix if you have one.

You will receive an acknowledgement within 7 days. Confirmed issues are fixed and disclosed within 30 days (critical: 7 days).

## Responsible Disclosure

- Give the maintainer reasonable time to fix before public disclosure.
- Do not exploit beyond what is necessary to demonstrate the issue.
- Do not access data that isn't yours.

Credit is offered in the release notes unless the reporter prefers anonymity.

## Dependency Updates

- Dependabot alerts are reviewed weekly.
- Critical CVEs: patched within 7 days.
- High CVEs: patched within 30 days.
- See [Dependencies](./docs/dependencies.md).

## Security Review Checklist

Before every release:

- [ ] `bun pm audit` (or equivalent) is clean for high/critical.
- [ ] No secrets in the repository (`.env` is gitignored).
- [ ] All public endpoints validate input with Zod.
- [ ] No unsafe `dangerouslySetInnerHTML` without sanitization.
- [ ] External links use `rel="noopener noreferrer"` when `target="_blank"`.
- [ ] Content Security Policy in place (if hosting allows).
- [ ] No PII in client-side analytics.
