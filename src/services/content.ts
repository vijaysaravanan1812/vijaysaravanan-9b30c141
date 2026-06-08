import { z } from "zod";
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
} from "@/data/schema";

import siteConfigRaw    from "@/data/site-config.json";
import profileRaw       from "@/data/profile.json";
import aboutRaw         from "@/data/about.json";
import experienceRaw    from "@/data/experience.json";
import projectsRaw      from "@/data/projects.json";
import skillsRaw        from "@/data/skills.json";
import educationRaw     from "@/data/education.json";
import publicationsRaw  from "@/data/publications.json";
import certificationsRaw from "@/data/certifications.json";
import achievementsRaw  from "@/data/achievements.json";
import contactRaw       from "@/data/contact.json";

/**
 * Parse + freeze. The Vite plugin (plugins/data-schema-validator.ts) catches
 * shape errors at build/dev time; this layer guarantees the runtime types
 * exposed to components match the Zod-inferred types exactly.
 */
function load<T extends z.ZodTypeAny>(
  schema: T,
  raw: unknown,
  file: string
): z.infer<T> {
  const res = schema.safeParse(raw);
  if (!res.success) {
    // Should never happen — the Vite plugin already validated. Throw loudly
    // with the same field paths so the cause is obvious.
    const summary = res.error.issues
      .map((i) => `${i.path.join(".") || "(root)"} — ${i.message}`)
      .join("\n  ");
    throw new Error(`Invalid src/data/${file}:\n  ${summary}`);
  }
  return Object.freeze(res.data) as z.infer<T>;
}

export const siteConfig     = load(siteConfigSchema,    siteConfigRaw,    "site-config.json");
export const profile        = load(profileSchema,       profileRaw,       "profile.json");
export const about          = load(aboutSchema,         aboutRaw,         "about.json");
export const experience     = load(experienceSchema,    experienceRaw,    "experience.json");
export const projects       = load(projectsSchema,      projectsRaw,      "projects.json");
export const skills         = load(skillsSchema,        skillsRaw,        "skills.json");
export const education      = load(educationSchema,     educationRaw,     "education.json");
export const publications   = load(publicationsSchema,  publicationsRaw,  "publications.json");
export const certifications = load(certificationsSchema, certificationsRaw, "certifications.json");
export const achievements   = load(achievementsSchema,  achievementsRaw,  "achievements.json");
export const contact        = load(contactSchema,       contactRaw,       "contact.json");

// ---- Typed helpers ----

/** Items whose `visible` flag is true. */
export function visibleOnly<T extends { visible: boolean }>(items: readonly T[]): T[] {
  return items.filter((i) => i.visible);
}

/** Is a top-level section (file + at least one visible item, if applicable) renderable? */
export function isSectionRenderable(id: string): boolean {
  const conf = siteConfig.sections.find((s) => s.id === id);
  if (!conf || !conf.visible) return false;

  switch (id) {
    case "about":          return about.visible;
    case "experience":     return experience.visible    && visibleOnly(experience.items).length    > 0;
    case "projects":       return projects.visible      && visibleOnly(projects.items).length      > 0;
    case "skills":         return skills.visible        && visibleOnly(skills.categories).length   > 0;
    case "education":      return education.visible     && visibleOnly(education.items).length     > 0;
    case "publications":   return publications.visible  && visibleOnly(publications.items).length  > 0;
    case "certifications": return certifications.visible && visibleOnly(certifications.items).length > 0;
    case "achievements":   return achievements.visible  && visibleOnly(achievements.items).length  > 0;
    case "contact":        return contact.visible;
    default:               return true;
  }
}

/** The sections that should appear in nav + page (in order, visibility-aware). */
export function visibleNavSections() {
  return siteConfig.sections.filter((s) => s.visible && isSectionRenderable(s.id));
}

export type { SectionConfig, Project, ExperienceItem, SkillCategory, EducationItem, Publication, Certification, Achievement, ContactLink, Social, Stat, Profile, About, Experience, Projects, Skills, Education, Publications, Certifications, Achievements, Contact, SiteConfig } from "@/data/types";
