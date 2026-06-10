/**
 * Schema migration helpers.
 *
 * Today the project ships at schemaVersion "2.0". When a future schema
 * change lands, add an entry to MIGRATIONS keyed by the OLD version,
 * returning the new shape. `migrate()` walks the chain.
 *
 * Usage in tests / one-off scripts:
 *   const v2 = migrate(rawJson, "2.0")
 */

export const CURRENT_SCHEMA_VERSION = "2.0" as const;

type Migrator = (input: unknown) => unknown;

const MIGRATIONS: Record<string, { to: string; run: Migrator }> = {
  // Example: "1.0": { to: "2.0", run: (d) => ({ ...d as object, schemaVersion: "2.0" }) },
};

export function migrate(raw: unknown, target: string = CURRENT_SCHEMA_VERSION): unknown {
  let current = raw;
  let from = (current as { schemaVersion?: string } | null)?.schemaVersion ?? target;
  const seen = new Set<string>();

  while (from !== target) {
    if (seen.has(from)) throw new Error(`Migration loop detected at ${from}`);
    seen.add(from);
    const step = MIGRATIONS[from];
    if (!step) {
      throw new Error(`No migration registered from schemaVersion "${from}" to "${target}".`);
    }
    current = step.run(current);
    from = step.to;
  }
  return current;
}
