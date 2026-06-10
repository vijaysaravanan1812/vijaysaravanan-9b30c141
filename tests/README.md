# tests/

Project-wide test suite. The folder is partitioned by _intent_, not by file
type, so a future contributor can find the test that protects a behaviour
without grepping the codebase.

```
tests/
├── unit/         # pure functions, no DOM
├── integration/  # JSON ➜ content service ➜ UI flows
├── schemas/      # Zod schema validation against JSON files & fixtures
├── content/      # content service helpers (visibleOnly, featuredOnly, autoStats)
├── navigation/   # menu generation + Nav component interaction
├── visibility/   # site-config + per-item visibility rules
├── search/       # SearchPalette indexing & filtering
├── migrations/   # schemaVersion migration round-trips
├── fixtures/     # canonical valid / invalid JSON inputs
└── helpers/      # shared utilities (render, readFixture, …)
```

Tests inside `src/**/__tests__/` are still picked up; they live next to the
code they cover and are typically smaller white-box tests. The `tests/`
suite is the black-box safety net for the portfolio's architectural rules.

## Running

```bash
bun run test            # one-shot
bun run test:watch      # watch mode
bun run test:coverage   # with coverage thresholds enforced
```

Coverage thresholds (configured in `vitest.config.ts`):
statements 90 · branches 85 · functions 90 · lines 90.
