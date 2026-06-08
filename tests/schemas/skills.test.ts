import { describe, it, expect } from "vitest";
import { skillsSchema } from "@/data/schema";
import skills from "@/data/skills.json";

describe("skillsSchema", () => {
  it("real skills.json passes", () => {
    expect(skillsSchema.safeParse(skills).success).toBe(true);
  });
  it("rejects category without visible flag", () => {
    const res = skillsSchema.safeParse({
      visible: true,
      categories: [{ name: "Languages", items: [] }],
    });
    expect(res.success).toBe(false);
  });
});
