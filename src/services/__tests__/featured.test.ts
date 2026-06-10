import { describe, it, expect } from "vitest";
import { featuredOnly, autoStats, visibleOnly } from "@/services/content";

describe("featuredOnly", () => {
  it("returns only items that are visible AND featured", () => {
    const items = [
      { visible: true, featured: true, id: "a" },
      { visible: true, featured: false, id: "b" },
      { visible: false, featured: true, id: "c" },
      { visible: true, id: "d" },
    ];
    expect(featuredOnly(items).map((i) => i.id)).toEqual(["a"]);
  });

  it("returns empty array when no items featured", () => {
    expect(featuredOnly([{ visible: true, id: "x" }])).toEqual([]);
  });
});

describe("autoStats", () => {
  it("returns numeric counts for every key", () => {
    const s = autoStats();
    for (const v of Object.values(s)) {
      expect(typeof v).toBe("number");
      expect(v).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("visibleOnly still works on v2 shapes", () => {
  it("handles items with extra optional fields like featured", () => {
    const items = [
      { visible: true, featured: false, id: 1 },
      { visible: false, id: 2 },
    ];
    expect(visibleOnly(items)).toHaveLength(1);
  });
});
