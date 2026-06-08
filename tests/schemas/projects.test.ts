import { describe, it, expect } from "vitest";
import { projectsSchema } from "@/data/schema";
import { readFixture } from "../helpers/content";

describe("projectsSchema fixtures", () => {
  it("accepts visible-projects.json", () => {
    expect(projectsSchema.safeParse(readFixture("visible-projects.json")).success).toBe(true);
  });
  it("accepts hidden-projects.json (structurally valid even if items hidden)", () => {
    expect(projectsSchema.safeParse(readFixture("hidden-projects.json")).success).toBe(true);
  });
  it("accepts empty-sections.json (empty items array)", () => {
    expect(projectsSchema.safeParse(readFixture("empty-sections.json")).success).toBe(true);
  });
  it("applies defaults for optional project fields", () => {
    const res = projectsSchema.safeParse({
      visible: true,
      items: [{ visible: true, title: "P", problem: "x", outcome: "y" }],
    });
    expect(res.success).toBe(true);
    if (res.success) {
      const item = res.data.items[0];
      expect(item.tags).toEqual([]);
      expect(item.stack).toEqual([]);
    }
  });
});
