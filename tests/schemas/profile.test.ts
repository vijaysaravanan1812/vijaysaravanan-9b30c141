import { describe, it, expect } from "vitest";
import { profileSchema } from "@/data/schema";
import { readFixture } from "../helpers/content";

describe("profileSchema fixtures", () => {
  it("accepts a valid-profile.json fixture", () => {
    const res = profileSchema.safeParse(readFixture("valid-profile.json"));
    expect(res.success).toBe(true);
  });

  it("rejects invalid-profile.json (empty name, bad social type, missing visible)", () => {
    const res = profileSchema.safeParse(readFixture("invalid-profile.json"));
    expect(res.success).toBe(false);
    if (!res.success) {
      const paths = res.error.issues.map((i) => i.path.join("."));
      expect(paths).toEqual(expect.arrayContaining(["name", "stats.0.visible", "socials.0.type"]));
    }
  });
});
