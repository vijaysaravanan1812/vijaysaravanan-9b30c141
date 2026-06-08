import { describe, it, expect } from "vitest";
import {
  siteConfigSchema,
  profileSchema,
  aboutSchema,
  experienceSchema,
  projectsSchema,
  skillsSchema,
  educationSchema,
  publicationsSchema,
  certificationsSchema,
  achievementsSchema,
  contactSchema,
  dataSchemas,
} from "@/data/schema";

import siteConfig from "@/data/site-config.json";
import profile from "@/data/profile.json";
import about from "@/data/about.json";
import experience from "@/data/experience.json";
import projects from "@/data/projects.json";
import skills from "@/data/skills.json";
import education from "@/data/education.json";
import publications from "@/data/publications.json";
import certifications from "@/data/certifications.json";
import achievements from "@/data/achievements.json";
import contact from "@/data/contact.json";

describe("dataSchemas registry", () => {
  it("registers all 23 data files (11 v1 + 12 v2)", () => {
    expect(Object.keys(dataSchemas)).toHaveLength(23);
  });
});

describe("real src/data JSON files", () => {
  const cases: Array<[string, unknown, (typeof dataSchemas)[keyof typeof dataSchemas]]> = [
    ["site-config", siteConfig, siteConfigSchema],
    ["profile", profile, profileSchema],
    ["about", about, aboutSchema],
    ["experience", experience, experienceSchema],
    ["projects", projects, projectsSchema],
    ["skills", skills, skillsSchema],
    ["education", education, educationSchema],
    ["publications", publications, publicationsSchema],
    ["certifications", certifications, certificationsSchema],
    ["achievements", achievements, achievementsSchema],
    ["contact", contact, contactSchema],
  ];

  it.each(cases)("%s.json passes its schema", (_name, raw, schema) => {
    const res = schema.safeParse(raw);
    if (!res.success) {
      throw new Error(JSON.stringify(res.error.issues, null, 2));
    }
    expect(res.success).toBe(true);
  });
});

describe("profileSchema", () => {
  const valid = {
    visible: true,
    name: "Jane",
    role: "Engineer",
    label: "Hello",
    tagline: "Tag",
    summary: "Summary",
    resumeUrl: "/r.pdf",
    stats: [{ label: "Years", value: "5", visible: true }],
    socials: [{ type: "github", url: "https://x", visible: false }],
  };

  it("accepts a valid profile", () => {
    expect(profileSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects missing visible flag on a stat", () => {
    const bad = { ...valid, stats: [{ label: "Years", value: "5" }] };
    const res = profileSchema.safeParse(bad);
    expect(res.success).toBe(false);
    if (!res.success) {
      const paths = res.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("stats.0.visible");
    }
  });

  it("rejects empty required strings", () => {
    const res = profileSchema.safeParse({ ...valid, name: "" });
    expect(res.success).toBe(false);
  });

  it("rejects unknown social type", () => {
    const res = profileSchema.safeParse({
      ...valid,
      socials: [{ type: "myspace", url: "x", visible: true }],
    });
    expect(res.success).toBe(false);
  });
});

describe("contactSchema", () => {
  const valid = {
    visible: true,
    heading: "Contact",
    email: "a@b.co",
    links: [{ label: "GH", url: "https://x", visible: true }],
  };

  it("accepts a valid contact", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects invalid email", () => {
    const res = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0].path).toContain("email");
    }
  });

  it("defaults subheading to empty string", () => {
    const res = contactSchema.safeParse(valid);
    expect(res.success).toBe(true);
    if (res.success) expect(res.data.subheading).toBe("");
  });
});

describe("projectsSchema", () => {
  it("applies defaults for optional fields", () => {
    const res = projectsSchema.safeParse({
      visible: true,
      items: [
        {
          visible: true,
          title: "P",
          problem: "x",
          outcome: "y",
        },
      ],
    });
    expect(res.success).toBe(true);
    if (res.success) {
      const item = res.data.items[0];
      expect(item.tags).toEqual([]);
      expect(item.stack).toEqual([]);
      expect(item.duration).toBe("");
      expect(item.github).toBe("");
      expect(item.demo).toBe("");
    }
  });

  it("rejects missing problem field", () => {
    const res = projectsSchema.safeParse({
      visible: true,
      items: [{ visible: true, title: "P", outcome: "y" }],
    });
    expect(res.success).toBe(false);
  });
});

describe("siteConfigSchema", () => {
  it("requires at least one rotating role and section", () => {
    const res = siteConfigSchema.safeParse({
      rotatingRoles: [],
      sections: [],
    });
    expect(res.success).toBe(false);
  });
});
