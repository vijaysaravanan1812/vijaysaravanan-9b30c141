/**
 * End-to-end (no DOM) integration test: JSON files on disk ➜ content service
 * ➜ visibleNavSections() output. Guards the JSON → Content Service → UI flow.
 */
import { describe, it, expect } from "vitest";
import { siteConfig, visibleNavSections, isSectionRenderable } from "@/services/content";

describe("integration — site-config.json drives navigation", () => {
  it("nav output is exactly the set of site-visible AND renderable sections", () => {
    const expected = siteConfig.sections
      .filter((s) => s.visible && isSectionRenderable(s.id))
      .map((s) => s.id);
    expect(visibleNavSections().map((s) => s.id)).toEqual(expected);
  });

  it("every nav section can be resolved back to its site-config entry", () => {
    for (const s of visibleNavSections()) {
      const conf = siteConfig.sections.find((c) => c.id === s.id);
      expect(conf).toBeDefined();
      expect(conf!.label).toBe(s.label);
    }
  });
});
