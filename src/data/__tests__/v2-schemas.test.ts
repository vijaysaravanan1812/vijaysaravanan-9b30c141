import { describe, it, expect } from "vitest";
import {
  timelineSchema,
  openSourceSchema,
  talksSchema,
  awardsSchema,
  blogSchema,
  startupsSchema,
  productsSchema,
  patentsSchema,
  mentoringSchema,
  mediaSchema,
  testimonialsSchema,
} from "@/data/schema";

describe("v2 section schemas — minimal valid shape", () => {
  const cases: [string, { safeParse: (v: unknown) => { success: boolean } }][] = [
    ["timeline", timelineSchema],
    ["open-source", openSourceSchema],
    ["talks", talksSchema],
    ["awards", awardsSchema],
    ["blog", blogSchema],
    ["startups", startupsSchema],
    ["products", productsSchema],
    ["patents", patentsSchema],
    ["mentoring", mentoringSchema],
    ["media", mediaSchema],
    ["testimonials", testimonialsSchema],
  ];
  it.each(cases)("%s accepts { visible:false, items:[] }", (_n, schema) => {
    expect(schema.safeParse({ visible: false, items: [] }).success).toBe(true);
  });
});

describe("v2 schemas reject missing visible", () => {
  it("timeline rejects item without visible", () => {
    const res = timelineSchema.safeParse({
      visible: true,
      items: [{ year: "2026", title: "X" }],
    });
    expect(res.success).toBe(false);
  });
});

describe("timeline accepts a complete item", () => {
  it("accepts the canonical shape", () => {
    const res = timelineSchema.safeParse({
      schemaVersion: "2.0",
      visible: true,
      items: [{ visible: true, year: "2026", title: "Joined", description: "..." }],
    });
    expect(res.success).toBe(true);
  });
});
