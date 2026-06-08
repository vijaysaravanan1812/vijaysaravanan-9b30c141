import { describe, it, expect } from "vitest";
import { migrate, CURRENT_SCHEMA_VERSION } from "@/data/migrate";

describe("migrate", () => {
  it("is a no-op when already current", () => {
    const input = { schemaVersion: CURRENT_SCHEMA_VERSION, foo: 1 };
    expect(migrate(input)).toEqual(input);
  });

  it("treats missing schemaVersion as already-current target", () => {
    const input = { foo: 1 };
    expect(migrate(input)).toEqual(input);
  });

  it("throws if asked to migrate from an unregistered version", () => {
    expect(() => migrate({ schemaVersion: "0.1" })).toThrow();
  });
});
