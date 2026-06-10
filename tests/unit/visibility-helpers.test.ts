import { describe, it, expect } from "vitest";
import { visibleOnly, featuredOnly } from "@/services/content";

describe("visibility helpers (pure)", () => {
  it("visibleOnly preserves item shape", () => {
    const items = [{ visible: true, label: "x", meta: { n: 1 } }];
    const out = visibleOnly(items);
    expect(out[0].label).toBe("x");
    expect(out[0].meta.n).toBe(1);
  });
  it("featuredOnly returns [] when nothing is featured", () => {
    expect(featuredOnly([{ visible: true, featured: false }, { visible: true }])).toEqual([]);
  });
});
