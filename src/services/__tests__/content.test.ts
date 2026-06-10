import { describe, it, expect } from "vitest";
import {
  visibleOnly,
  isSectionRenderable,
  visibleNavSections,
  siteConfig,
  profile,
  contact,
  experience,
  projects,
  skills,
  education,
  publications,
  certifications,
  achievements,
  timeline,
  openSource,
  talks,
  awards,
  blog,
  startups,
  products,
  patents,
  mentoring,
  media,
  testimonials,
  competitiveProgramming,
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

describe("navigation visibility contract", () => {
  const hiddenSectionIds = [
    "startups",
    "products",
    "patents",
    "mentoring",
    "media",
    "testimonials",
  ];

  const expectedVisibleNavIds = [
    "about",
    "experience",
    "projects",
    "skills",
    "competitive-programming",
    "education",
    "achievements",
    "contact",
  ];

  it("excludes all sections marked visible:false in site-config", () => {
    const navIds = visibleNavSections().map((s) => s.id);
    for (const id of hiddenSectionIds) {
      const conf = siteConfig.sections.find((s) => s.id === id);
      expect(conf?.visible).toBe(false);
      expect(navIds).not.toContain(id);
    }
  });

  it("includes all expected visible sections in correct order", () => {
    const navIds = visibleNavSections().map((s) => s.id);
    expect(navIds).toEqual(expectedVisibleNavIds);
  });

  it("renders contact section when visible", () => {
    expect(contact.visible).toBe(true);
    expect(isSectionRenderable("contact")).toBe(true);
    expect(visibleNavSections().some((s) => s.id === "contact")).toBe(true);
  });

  it("hides experience when it has zero visible items", () => {
    const visibleItems = visibleOnly(experience.items);
    if (visibleItems.length === 0) {
      expect(isSectionRenderable("experience")).toBe(false);
    } else {
      expect(isSectionRenderable("experience")).toBe(true);
    }
  });

  it("hides projects when it has zero visible items", () => {
    const visibleItems = visibleOnly(projects.items);
    if (visibleItems.length === 0) {
      expect(isSectionRenderable("projects")).toBe(false);
    } else {
      expect(isSectionRenderable("projects")).toBe(true);
    }
  });

  it("hides skills when it has zero visible categories", () => {
    const visibleCategories = visibleOnly(skills.categories);
    if (visibleCategories.length === 0) {
      expect(isSectionRenderable("skills")).toBe(false);
    } else {
      expect(isSectionRenderable("skills")).toBe(true);
    }
  });

  it("hides competitive-programming when it has zero visible platforms", () => {
    const visiblePlatforms = visibleOnly(competitiveProgramming.platforms);
    if (visiblePlatforms.length === 0) {
      expect(isSectionRenderable("competitive-programming")).toBe(false);
    } else {
      expect(isSectionRenderable("competitive-programming")).toBe(true);
    }
  });

  it("hides education when it has zero visible items", () => {
    const visibleItems = visibleOnly(education.items);
    if (visibleItems.length === 0) {
      expect(isSectionRenderable("education")).toBe(false);
    } else {
      expect(isSectionRenderable("education")).toBe(true);
    }
  });

  it("hides publications when it has zero visible items", () => {
    const visibleItems = visibleOnly(publications.items);
    if (visibleItems.length === 0) {
      expect(isSectionRenderable("publications")).toBe(false);
    } else {
      expect(isSectionRenderable("publications")).toBe(true);
    }
  });

  it("hides certifications when it has zero visible items", () => {
    const visibleItems = visibleOnly(certifications.items);
    if (visibleItems.length === 0) {
      expect(isSectionRenderable("certifications")).toBe(false);
    } else {
      expect(isSectionRenderable("certifications")).toBe(true);
    }
  });

  it("hides achievements when it has zero visible items", () => {
    const visibleItems = visibleOnly(achievements.items);
    if (visibleItems.length === 0) {
      expect(isSectionRenderable("achievements")).toBe(false);
    } else {
      expect(isSectionRenderable("achievements")).toBe(true);
    }
  });

  it("hides timeline when it has zero visible items", () => {
    const visibleItems = visibleOnly(timeline.items);
    if (visibleItems.length === 0) {
      expect(isSectionRenderable("timeline")).toBe(false);
    } else {
      expect(isSectionRenderable("timeline")).toBe(true);
    }
  });

  it("hides open-source when it has zero visible items", () => {
    const visibleItems = visibleOnly(openSource.items);
    if (visibleItems.length === 0) {
      expect(isSectionRenderable("open-source")).toBe(false);
    } else {
      expect(isSectionRenderable("open-source")).toBe(true);
    }
  });

  it("hides talks when it has zero visible items", () => {
    const visibleItems = visibleOnly(talks.items);
    if (visibleItems.length === 0) {
      expect(isSectionRenderable("talks")).toBe(false);
    } else {
      expect(isSectionRenderable("talks")).toBe(true);
    }
  });

  it("hides awards when it has zero visible items", () => {
    const visibleItems = visibleOnly(awards.items);
    if (visibleItems.length === 0) {
      expect(isSectionRenderable("awards")).toBe(false);
    } else {
      expect(isSectionRenderable("awards")).toBe(true);
    }
  });

  it("hides blog when it has zero visible items", () => {
    const visibleItems = visibleOnly(blog.items);
    if (visibleItems.length === 0) {
      expect(isSectionRenderable("blog")).toBe(false);
    } else {
      expect(isSectionRenderable("blog")).toBe(true);
    }
  });

  it("hides startups regardless of items because section visible:false", () => {
    expect(startups.visible).toBe(false);
    expect(isSectionRenderable("startups")).toBe(false);
  });

  it("hides products regardless of items because section visible:false", () => {
    expect(products.visible).toBe(false);
    expect(isSectionRenderable("products")).toBe(false);
  });

  it("hides patents regardless of items because section visible:false", () => {
    expect(patents.visible).toBe(false);
    expect(isSectionRenderable("patents")).toBe(false);
  });

  it("hides mentoring regardless of items because section visible:false", () => {
    expect(mentoring.visible).toBe(false);
    expect(isSectionRenderable("mentoring")).toBe(false);
  });

  it("hides media regardless of items because section visible:false", () => {
    expect(media.visible).toBe(false);
    expect(isSectionRenderable("media")).toBe(false);
  });

  it("hides testimonials regardless of items because section visible:false", () => {
    expect(testimonials.visible).toBe(false);
    expect(isSectionRenderable("testimonials")).toBe(false);
  });
});

describe("item-level visibility within sections", () => {
  it("filters out invisible experience items", () => {
    const visibleItems = visibleOnly(experience.items);
    expect(visibleItems.every((i) => i.visible)).toBe(true);
    if (experience.items.length > 0) {
      expect(visibleItems.length).toBeLessThanOrEqual(experience.items.length);
    }
  });

  it("filters out invisible project items", () => {
    const visibleItems = visibleOnly(projects.items);
    expect(visibleItems.every((i) => i.visible)).toBe(true);
    if (projects.items.length > 0) {
      expect(visibleItems.length).toBeLessThanOrEqual(projects.items.length);
    }
  });

  it("filters out invisible competitive programming platforms", () => {
    const visiblePlatforms = visibleOnly(competitiveProgramming.platforms);
    expect(visiblePlatforms.every((p) => p.visible)).toBe(true);
    if (competitiveProgramming.platforms.length > 0) {
      expect(visiblePlatforms.length).toBeLessThanOrEqual(competitiveProgramming.platforms.length);
    }
  });

  it("only LeetCode platform is visible in competitive programming", () => {
    const visiblePlatforms = visibleOnly(competitiveProgramming.platforms);
    const visibleNames = visiblePlatforms.map((p) => p.platform);
    expect(visibleNames).toEqual(["LeetCode"]);
  });
});
