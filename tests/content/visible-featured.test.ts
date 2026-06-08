import { describe, it, expect } from "vitest";
import {
  visibleOnly,
  featuredOnly,
  autoStats,
  projects,
  competitiveProgramming,
} from "@/services/content";

describe("visibleOnly()", () => {
  it("returns only items with visible=true", () => {
    expect(
      visibleOnly([
        { visible: true, id: "a" },
        { visible: false, id: "b" },
      ]).map((i) => i.id)
    ).toEqual(["a"]);
  });
  it("returns [] for empty input", () => {
    expect(visibleOnly([])).toEqual([]);
  });
});

describe("featuredOnly()", () => {
  it("requires both visible and featured to be true", () => {
    const items = [
      { visible: true, featured: true, id: "a" },
      { visible: true, featured: false, id: "b" },
      { visible: false, featured: true, id: "c" },
      { visible: true, id: "d" },
    ];
    expect(featuredOnly(items).map((i) => i.id)).toEqual(["a"]);
  });
});

describe("autoStats()", () => {
  it("counts only visible items per section", () => {
    const stats = autoStats();
    expect(stats.projects).toBe(visibleOnly(projects.items).length);
    expect(stats.cpPlatformsActive).toBe(
      visibleOnly(competitiveProgramming.platforms).length
    );
  });
  it("cpProblemsSolved aggregates problemsSolved across visible platforms", () => {
    const expected = visibleOnly(competitiveProgramming.platforms).reduce(
      (sum, p) => sum + (typeof p.problemsSolved === "number" ? p.problemsSolved : 0),
      0
    );
    expect(autoStats().cpProblemsSolved).toBe(expected);
  });
});
