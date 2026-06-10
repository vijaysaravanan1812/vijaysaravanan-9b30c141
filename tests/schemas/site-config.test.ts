import { describe, it, expect } from "vitest";
import { siteConfigSchema } from "@/data/schema";

describe("siteConfigSchema", () => {
  it("rejects empty rotatingRoles or sections", () => {
    expect(siteConfigSchema.safeParse({ rotatingRoles: [], sections: [] }).success).toBe(false);
  });

  it("requires id, label and visible per section", () => {
    const res = siteConfigSchema.safeParse({
      rotatingRoles: ["Engineer"],
      sections: [{ id: "", label: "", visible: true }],
    });
    expect(res.success).toBe(false);
  });

  it("accepts a minimal valid config", () => {
    const res = siteConfigSchema.safeParse({
      rotatingRoles: ["Engineer"],
      sections: [{ id: "about", label: "About", visible: true }],
    });
    expect(res.success).toBe(true);
  });
});
