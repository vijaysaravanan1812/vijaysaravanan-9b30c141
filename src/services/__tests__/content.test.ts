import { describe, it, expect } from "vitest";
import {
  visibleOnly,
  isSectionRenderable,
  visibleNavSections,
  siteConfig,
  profile,
  contact,
} from "@/services/content";

describe("visibleOnly", () => {
  it("returns only items with visible=true", () => {
    const items = [
      { id: "a", visible: true },
      { id: "b", visible: false },
      { id: "c", visible: true },
    ];
    expect(visibleOnly(items).map((i) => i.id)).toEqual(["a", "c"]);
  });

  it("returns empty array when nothing is visible", () => {
    expect(visibleOnly([{ visible: false }, { visible: false }])).toEqual([]);
  });

  it("returns empty array on empty input", () => {
    expect(visibleOnly([])).toEqual([]);
  });

  it("preserves item shape and additional fields", () => {
    const items = [{ visible: true, label: "x", meta: { n: 1 } }];
    const out = visibleOnly(items);
    expect(out[0].label).toBe("x");
    expect(out[0].meta.n).toBe(1);
  });
});

describe("typed loaders", () => {
  it("freezes loaded data", () => {
    expect(Object.isFrozen(profile)).toBe(true);
    expect(Object.isFrozen(siteConfig)).toBe(true);
    expect(Object.isFrozen(contact)).toBe(true);
  });

  it("profile exposes required fields", () => {
    expect(typeof profile.name).toBe("string");
    expect(profile.name.length).toBeGreaterThan(0);
    expect(Array.isArray(profile.stats)).toBe(true);
    expect(Array.isArray(profile.socials)).toBe(true);
  });

  it("contact email parses as email", () => {
    expect(contact.email).toMatch(/.+@.+\..+/);
  });
});

describe("isSectionRenderable / visibleNavSections", () => {
  it("returns false for unknown section ids", () => {
    expect(isSectionRenderable("does-not-exist")).toBe(false);
  });

  it("visibleNavSections only contains visible section configs", () => {
    const nav = visibleNavSections();
    expect(nav.every((s) => s.visible)).toBe(true);
    for (const s of nav) {
      expect(isSectionRenderable(s.id)).toBe(true);
    }
  });

  it("nav sections are a subset of siteConfig.sections in order", () => {
    const nav = visibleNavSections().map((s) => s.id);
    const all = siteConfig.sections.map((s) => s.id);
    let last = -1;
    for (const id of nav) {
      const idx = all.indexOf(id);
      expect(idx).toBeGreaterThan(last);
      last = idx;
    }
  });
});
