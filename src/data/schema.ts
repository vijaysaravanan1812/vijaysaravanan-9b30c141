import { z } from "zod";

// Reusable visible flag
const visible = z.boolean({
  required_error: "missing required `visible` flag (true | false)",
});

// Each schema uses `.strict()`-style messages via custom required_error messages so
// build-time errors point at the missing field directly.

export const siteConfigSchema = z.object({
  theme: z.enum(["dark", "light"]).optional(),
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

export const profileSchema = z.object({
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

export const aboutSchema = z.object({
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

export const experienceSchema = z.object({
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

export const projectsSchema = z.object({
  visible,
  items: z.array(
    z.object({
      visible,
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

export const skillsSchema = z.object({
  visible,
  categories: z.array(
    z.object({
      visible,
      name: z.string().min(1),
      items: z.array(z.string().min(1)),
    })
  ),
});

export const educationSchema = z.object({
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

export const publicationsSchema = z.object({
  visible,
  items: z.array(
    z.object({
      visible,
      title: z.string().min(1),
      authors: z.string().optional(),
      venue: z.string().optional(),
      year: z.union([z.string(), z.number()]).optional(),
      doi: z.string().optional(),
      link: z.string().optional(),
    })
  ),
});

export const certificationsSchema = z.object({
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

export const achievementsSchema = z.object({
  visible,
  items: z.array(
    z.object({
      visible,
      category: z.string().min(1),
      title: z.string().min(1),
      detail: z.string().optional(),
    })
  ),
});

export const contactSchema = z.object({
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
} as const;

export type DataFileName = keyof typeof dataSchemas;
