import { describe, it, expect } from "vitest";
import { migrate, CURRENT_SCHEMA_VERSION } from "@/data/migrate";

describe("migrate()", () => {
  it("is a no-op when input already at target version", () => {
    const input = { schemaVersion: CURRENT_SCHEMA_VERSION, foo: 1 };
    expect(migrate(input)).toEqual(input);
  });

  it("treats missing schemaVersion as already-current target", () => {
    expect(migrate({ foo: 1 })).toEqual({ foo: 1 });
  });

  it("throws if asked to migrate from an unregistered version", () => {
    expect(() => migrate({ schemaVersion: "0.1" })).toThrow();
  });

  it("preserves all data fields when no migration is needed (no data loss)", () => {
    const input = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      nested: { a: 1, b: [1, 2, 3], c: "x" },
      arr: [{ visible: true, name: "x" }],
    };
    expect(migrate(input)).toEqual(input);
  });
});

describe("migrate() — round-trip simulation for future v1→v2", () => {
  it("documents the intended contract: same version in == same data out", () => {
    // When a real v1→v2 migration is added, replace this with a fixture-based
    // round-trip ensuring no field is dropped.
    const v2 = { schemaVersion: "2.0", visible: true, items: [] };
    expect(migrate(v2)).toEqual(v2);
  });
});
