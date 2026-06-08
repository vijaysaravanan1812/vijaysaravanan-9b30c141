import { describe, it, expect } from "vitest";
import {
  isSectionRenderable,
  visibleNavSections,
  visibleOnly,
  siteConfig,
  experience,
  projects,
  skills,
  competitiveProgramming,
  startups,
  products,
  patents,
  mentoring,
  media,
  testimonials,
  contact,
} from "@/services/content";

describe("visible:true renders, visible:false hides", () => {
  it("contact (visible:true) is renderable", () => {
    expect(contact.visible).toBe(true);
    expect(isSectionRenderable("contact")).toBe(true);
  });

  it.each([
    ["startups", startups],
    ["products", products],
    ["patents", patents],
    ["mentoring", mentoring],
    ["media", media],
    ["testimonials", testimonials],
  ] as const)("%s (visible:false at site-config) is not renderable", (id, data) => {
    expect(siteConfig.sections.find((s) => s.id === id)?.visible).toBe(false);
    expect(isSectionRenderable(id)).toBe(false);
    expect(data.visible).toBe(false);
  });
});

describe("empty sections auto-hide", () => {
  it.each([
    ["experience", experience.items as readonly { visible: boolean }[]],
    ["projects", projects.items as readonly { visible: boolean }[]],
    ["skills", skills.categories as readonly { visible: boolean }[]],
    ["competitive-programming", competitiveProgramming.platforms as readonly { visible: boolean }[]],
  ] as const)("%s renderable iff at least one visible child", (id, items) => {
    const hasVisible = visibleOnly(items).length > 0;
    expect(isSectionRenderable(id)).toBe(hasVisible);
  });
});

describe("hidden sections disappear from navigation", () => {
  it("hidden section ids are absent from visibleNavSections()", () => {
    const navIds = visibleNavSections().map((s) => s.id);
    for (const id of ["startups", "products", "patents", "mentoring", "media", "testimonials"]) {
      expect(navIds).not.toContain(id);
    }
  });
});
