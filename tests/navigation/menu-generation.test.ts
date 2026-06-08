import { describe, it, expect } from "vitest";
import { siteConfig, visibleNavSections, isSectionRenderable } from "@/services/content";

describe("menu generation from site-config.json", () => {
  it("preserves the order declared in site-config.sections", () => {
    const nav = visibleNavSections().map((s) => s.id);
    const all = siteConfig.sections.map((s) => s.id);
    let cursor = -1;
    for (const id of nav) {
      const idx = all.indexOf(id);
      expect(idx).toBeGreaterThan(cursor);
      cursor = idx;
    }
  });

  it("includes every section that is both site-visible and has visible children", () => {
    const expected = siteConfig.sections
      .filter((s) => s.visible && isSectionRenderable(s.id))
      .map((s) => s.id);
    expect(visibleNavSections().map((s) => s.id)).toEqual(expected);
  });
});
