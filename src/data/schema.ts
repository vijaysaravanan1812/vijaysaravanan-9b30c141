import { z } from "zod";

/**
 * Schema layer for src/data/*.json. Each schema gives the Vite plugin
 * (plugins/data-schema-validator.ts) and the runtime loader
 * (src/services/content.ts) a single source of truth.
 *
 * Versioning: every schema accepts an OPTIONAL `schemaVersion` string so
 * data files can be migrated over time without breaking older content.
 * Today's version is "2.0".
 */

const visible = z.boolean({
  required_error: "missing required `visible` flag (true | false)",
});

const featured = z.boolean().optional();
const schemaVersion = z.string().optional();

// ──────────────────────────────────────────────────────────────
// Site config
// ──────────────────────────────────────────────────────────────
export const siteConfigSchema = z.object({
  schemaVersion,
  theme: z.enum(["dark", "light"]).optional(),
  analyticsEnabled: z.boolean().optional().default(false),
  resumeArchive: z
    .array(
      z.object({
        year: z.union([z.string(), z.number()]),
        label: z.string().min(1),
        url: z.string().min(1),
        visible,
      })
    )
    .optional()
    .default([]),
  rotatingRoles: z.array(z.string().min(1)).min(1, "rotatingRoles cannot be empty"),
  sections: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        visible,
      })
    )
    .min(1, "sections must list at least one section"),
});

// ──────────────────────────────────────────────────────────────
// Profile
// ──────────────────────────────────────────────────────────────
export const profileSchema = z.object({
  schemaVersion,
  visible,
  name: z.string().min(1),
  role: z.string().min(1),
  label: z.string().min(1),
  tagline: z.string().min(1),
  summary: z.string().min(1),
  location: z.string().optional(),
  resumeUrl: z.string().min(1),
  stats: z.array(
    z.object({ label: z.string().min(1), value: z.string().min(1), visible })
  ),
  socials: z.array(
    z.object({
      type: z.enum(["github", "linkedin", "email", "twitter", "website"]),
      url: z.string().min(1),
      visible,
    })
  ),
});

// ──────────────────────────────────────────────────────────────
// About
// ──────────────────────────────────────────────────────────────
export const aboutSchema = z.object({
  schemaVersion,
  visible,
  heading: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
  principles: z
    .object({
      title: z.string().min(1),
      items: z.array(z.string().min(1)),
    })
    .optional(),
});

// ──────────────────────────────────────────────────────────────
// Experience
// ──────────────────────────────────────────────────────────────
export const experienceSchema = z.object({
  schemaVersion,
  visible,
  items: z.array(
    z.object({
      visible,
      company: z.string().min(1),
      position: z.string().min(1),
      location: z.string().optional(),
      duration: z.string().min(1),
      highlights: z.array(z.string().min(1)).min(1),
      stack: z.array(z.string().min(1)).optional(),
    })
  ),
});

// ──────────────────────────────────────────────────────────────
// Projects (now supports `featured`)
// ──────────────────────────────────────────────────────────────
export const projectsSchema = z.object({
  schemaVersion,
  visible,
  items: z.array(
    z.object({
      visible,
      featured,
      title: z.string().min(1),
      tags: z.array(z.string()).default([]),
      stack: z.array(z.string()).default([]),
      duration: z.string().optional().default(""),
      problem: z.string().min(1),
      outcome: z.string().min(1),
      github: z.string().optional().default(""),
      demo: z.string().optional().default(""),
    })
  ),
});

// ──────────────────────────────────────────────────────────────
// Skills
// ──────────────────────────────────────────────────────────────
export const skillsSchema = z.object({
  schemaVersion,
  visible,
  categories: z.array(
    z.object({
      visible,
      name: z.string().min(1),
      items: z.array(z.string().min(1)),
    })
  ),
});

// ──────────────────────────────────────────────────────────────
// Education
// ──────────────────────────────────────────────────────────────
export const educationSchema = z.object({
  schemaVersion,
  visible,
  items: z.array(
    z.object({
      visible,
      institution: z.string().min(1),
      degree: z.string().min(1),
      duration: z.string().min(1),
      location: z.string().optional(),
      grade: z.string().optional().default(""),
    })
  ),
});

// ──────────────────────────────────────────────────────────────
// Publications (featured)
// ──────────────────────────────────────────────────────────────
export const publicationsSchema = z.object({
  schemaVersion,
  visible,
  items: z.array(
    z.object({
      visible,
      featured,
      title: z.string().min(1),
      authors: z.string().optional(),
      venue: z.string().optional(),
      year: z.union([z.string(), z.number()]).optional(),
      doi: z.string().optional(),
      link: z.string().optional(),
    })
  ),
});

// ──────────────────────────────────────────────────────────────
// Certifications
// ──────────────────────────────────────────────────────────────
export const certificationsSchema = z.object({
  schemaVersion,
  visible,
  items: z.array(
    z.object({
      visible,
      certificate: z.string().min(1),
      organization: z.string().optional(),
      year: z.union([z.string(), z.number()]).optional(),
    })
  ),
});

// ──────────────────────────────────────────────────────────────
// Achievements (featured)
// ──────────────────────────────────────────────────────────────
export const achievementsSchema = z.object({
  schemaVersion,
  visible,
  items: z.array(
    z.object({
      visible,
      featured,
      category: z.string().min(1),
      title: z.string().min(1),
      detail: z.string().optional(),
    })
  ),
});

// ──────────────────────────────────────────────────────────────
// Contact
// ──────────────────────────────────────────────────────────────
export const contactSchema = z.object({
  schemaVersion,
  visible,
  heading: z.string().min(1),
  subheading: z.string().optional().default(""),
  email: z.string().email("`email` must be a valid email address"),
  links: z.array(
    z.object({
      label: z.string().min(1),
      url: z.string().min(1),
      visible,
    })
  ),
});

// ──────────────────────────────────────────────────────────────
// v2 — Career Timeline
// ──────────────────────────────────────────────────────────────
export const timelineSchema = z.object({
  schemaVersion,
  visible,
  items: z.array(
    z.object({
      visible,
      year: z.union([z.string(), z.number()]),
      title: z.string().min(1),
      description: z.string().optional().default(""),
    })
  ),
});

// ──────────────────────────────────────────────────────────────
// v2 — Open Source
// ──────────────────────────────────────────────────────────────
export const openSourceSchema = z.object({
  schemaVersion,
  visible,
  items: z.array(
    z.object({
      visible,
      project: z.string().min(1),
      repository: z.string().optional().default(""),
      description: z.string().optional().default(""),
      url: z.string().optional().default(""),
    })
  ),
});

// ──────────────────────────────────────────────────────────────
// v2 — Talks & Presentations (featured)
// ──────────────────────────────────────────────────────────────
export const talksSchema = z.object({
  schemaVersion,
  visible,
  items: z.array(
    z.object({
      visible,
      featured,
      title: z.string().min(1),
      kind: z.enum(["conference", "workshop", "lecture", "webinar", "podcast"]).optional(),
      venue: z.string().optional().default(""),
      date: z.string().optional().default(""),
      url: z.string().optional().default(""),
      description: z.string().optional().default(""),
    })
  ),
});

// ──────────────────────────────────────────────────────────────
// v2 — Awards (separate from achievements)
// ──────────────────────────────────────────────────────────────
export const awardsSchema = z.object({
  schemaVersion,
  visible,
  items: z.array(
    z.object({
      visible,
      title: z.string().min(1),
      issuer: z.string().optional().default(""),
      year: z.union([z.string(), z.number()]).optional(),
      detail: z.string().optional().default(""),
    })
  ),
});

// ──────────────────────────────────────────────────────────────
// v2 — Blog (external URLs)
// ──────────────────────────────────────────────────────────────
export const blogSchema = z.object({
  schemaVersion,
  visible,
  items: z.array(
    z.object({
      visible,
      title: z.string().min(1),
      date: z.string().optional().default(""),
      summary: z.string().optional().default(""),
      url: z.string().optional().default(""),
      tags: z.array(z.string()).optional().default([]),
    })
  ),
});

// ──────────────────────────────────────────────────────────────
// v2 — Future sections (hidden by default until populated)
// ──────────────────────────────────────────────────────────────
export const startupsSchema = z.object({
  schemaVersion,
  visible,
  items: z.array(
    z.object({
      visible,
      name: z.string().min(1),
      role: z.string().optional().default(""),
      tagline: z.string().optional().default(""),
      url: z.string().optional().default(""),
      duration: z.string().optional().default(""),
      detail: z.string().optional().default(""),
    })
  ),
});

export const productsSchema = z.object({
  schemaVersion,
  visible,
  items: z.array(
    z.object({
      visible,
      name: z.string().min(1),
      tagline: z.string().optional().default(""),
      url: z.string().optional().default(""),
      description: z.string().optional().default(""),
    })
  ),
});

export const patentsSchema = z.object({
  schemaVersion,
  visible,
  items: z.array(
    z.object({
      visible,
      title: z.string().min(1),
      number: z.string().optional().default(""),
      year: z.union([z.string(), z.number()]).optional(),
      url: z.string().optional().default(""),
      detail: z.string().optional().default(""),
    })
  ),
});

export const mentoringSchema = z.object({
  schemaVersion,
  visible,
  items: z.array(
    z.object({
      visible,
      program: z.string().min(1),
      role: z.string().optional().default(""),
      duration: z.string().optional().default(""),
      detail: z.string().optional().default(""),
    })
  ),
});

export const mediaSchema = z.object({
  schemaVersion,
  visible,
  items: z.array(
    z.object({
      visible,
      title: z.string().min(1),
      outlet: z.string().optional().default(""),
      date: z.string().optional().default(""),
      url: z.string().optional().default(""),
    })
  ),
});

export const testimonialsSchema = z.object({
  schemaVersion,
  visible,
  items: z.array(
    z.object({
      visible,
      quote: z.string().min(1),
      author: z.string().min(1),
      role: z.string().optional().default(""),
      company: z.string().optional().default(""),
    })
  ),
});

// ──────────────────────────────────────────────────────────────
// Registry
// ──────────────────────────────────────────────────────────────
export const dataSchemas = {
  "site-config.json": siteConfigSchema,
  "profile.json": profileSchema,
  "about.json": aboutSchema,
  "experience.json": experienceSchema,
  "projects.json": projectsSchema,
  "skills.json": skillsSchema,
  "education.json": educationSchema,
  "publications.json": publicationsSchema,
  "certifications.json": certificationsSchema,
  "achievements.json": achievementsSchema,
  "contact.json": contactSchema,
  // v2 additions
  "timeline.json": timelineSchema,
  "open-source.json": openSourceSchema,
  "talks.json": talksSchema,
  "awards.json": awardsSchema,
  "blog.json": blogSchema,
  "startups.json": startupsSchema,
  "products.json": productsSchema,
  "patents.json": patentsSchema,
  "mentoring.json": mentoringSchema,
  "media.json": mediaSchema,
  "testimonials.json": testimonialsSchema,
} as const;

export type DataFileName = keyof typeof dataSchemas;
