/**
 * Content service — the ONLY place the rest of the app talks to data.
 *
 * Today's adapter loads JSON files bundled at build time. To swap in a
 * CMS or HTTP API later, replace the imports below with another adapter
 * that produces the same parsed/frozen objects — no component change.
 */
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
  competitiveProgrammingSchema,
} from "@/data/schema";

import siteConfigRaw     from "@/data/site-config.json";
import profileRaw        from "@/data/profile.json";
import aboutRaw          from "@/data/about.json";
import experienceRaw     from "@/data/experience.json";
import projectsRaw       from "@/data/projects.json";
import skillsRaw         from "@/data/skills.json";
import educationRaw      from "@/data/education.json";
import publicationsRaw   from "@/data/publications.json";
import certificationsRaw from "@/data/certifications.json";
import achievementsRaw   from "@/data/achievements.json";
import contactRaw        from "@/data/contact.json";
import timelineRaw       from "@/data/timeline.json";
import openSourceRaw     from "@/data/open-source.json";
import talksRaw          from "@/data/talks.json";
import awardsRaw         from "@/data/awards.json";
import blogRaw           from "@/data/blog.json";
import startupsRaw       from "@/data/startups.json";
import productsRaw       from "@/data/products.json";
import patentsRaw        from "@/data/patents.json";
import mentoringRaw      from "@/data/mentoring.json";
import mediaRaw          from "@/data/media.json";
import testimonialsRaw   from "@/data/testimonials.json";
import competitiveProgrammingRaw from "@/data/competitive-programming.json";

function load<T extends z.ZodTypeAny>(
  schema: T,
  raw: unknown,
  file: string
): z.infer<T> {
  const res = schema.safeParse(raw);
  if (!res.success) {
    const summary = res.error.issues
      .map((i) => `${i.path.join(".") || "(root)"} — ${i.message}`)
      .join("\n  ");
    throw new Error(`Invalid src/data/${file}:\n  ${summary}`);
  }
  return Object.freeze(res.data) as z.infer<T>;
}

export const siteConfig     = load(siteConfigSchema,     siteConfigRaw,     "site-config.json");
export const profile        = load(profileSchema,        profileRaw,        "profile.json");
export const about          = load(aboutSchema,          aboutRaw,          "about.json");
export const experience     = load(experienceSchema,     experienceRaw,     "experience.json");
export const projects       = load(projectsSchema,       projectsRaw,       "projects.json");
export const skills         = load(skillsSchema,         skillsRaw,         "skills.json");
export const education      = load(educationSchema,      educationRaw,      "education.json");
export const publications   = load(publicationsSchema,   publicationsRaw,   "publications.json");
export const certifications = load(certificationsSchema, certificationsRaw, "certifications.json");
export const achievements   = load(achievementsSchema,   achievementsRaw,   "achievements.json");
export const contact        = load(contactSchema,        contactRaw,        "contact.json");
export const timeline       = load(timelineSchema,       timelineRaw,       "timeline.json");
export const openSource     = load(openSourceSchema,     openSourceRaw,     "open-source.json");
export const talks          = load(talksSchema,          talksRaw,          "talks.json");
export const awards         = load(awardsSchema,         awardsRaw,         "awards.json");
export const blog           = load(blogSchema,           blogRaw,           "blog.json");
export const startups       = load(startupsSchema,       startupsRaw,       "startups.json");
export const products       = load(productsSchema,       productsRaw,       "products.json");
export const patents        = load(patentsSchema,        patentsRaw,        "patents.json");
export const mentoring      = load(mentoringSchema,      mentoringRaw,      "mentoring.json");
export const media          = load(mediaSchema,          mediaRaw,          "media.json");
export const testimonials   = load(testimonialsSchema,   testimonialsRaw,   "testimonials.json");
export const competitiveProgramming = load(
  competitiveProgrammingSchema,
  competitiveProgrammingRaw,
  "competitive-programming.json"
);

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────
export function visibleOnly<T extends { visible: boolean }>(items: readonly T[]): T[] {
  return items.filter((i) => i.visible);
}

export function featuredOnly<T extends { visible: boolean; featured?: boolean }>(
  items: readonly T[]
): T[] {
  return items.filter((i) => i.visible && i.featured === true);
}

/** Has at least one visible item in the named section. */
function hasItems(id: string): boolean {
  switch (id) {
    case "about":          return about.visible;
    case "experience":     return experience.visible    && visibleOnly(experience.items).length    > 0;
    case "projects":       return projects.visible      && visibleOnly(projects.items).length      > 0;
    case "skills":         return skills.visible        && visibleOnly(skills.categories).length   > 0;
    case "competitive-programming":
                           return competitiveProgramming.visible && visibleOnly(competitiveProgramming.platforms).length > 0;
    case "education":      return education.visible     && visibleOnly(education.items).length     > 0;
    case "publications":   return publications.visible  && visibleOnly(publications.items).length  > 0;
    case "certifications": return certifications.visible && visibleOnly(certifications.items).length > 0;
    case "achievements":   return achievements.visible  && visibleOnly(achievements.items).length  > 0;
    case "timeline":       return timeline.visible      && visibleOnly(timeline.items).length      > 0;
    case "open-source":    return openSource.visible    && visibleOnly(openSource.items).length    > 0;
    case "talks":          return talks.visible         && visibleOnly(talks.items).length         > 0;
    case "awards":         return awards.visible        && visibleOnly(awards.items).length        > 0;
    case "blog":           return blog.visible          && visibleOnly(blog.items).length          > 0;
    case "startups":       return startups.visible      && visibleOnly(startups.items).length      > 0;
    case "products":       return products.visible      && visibleOnly(products.items).length      > 0;
    case "patents":        return patents.visible       && visibleOnly(patents.items).length       > 0;
    case "mentoring":      return mentoring.visible     && visibleOnly(mentoring.items).length     > 0;
    case "media":          return media.visible         && visibleOnly(media.items).length         > 0;
    case "testimonials":   return testimonials.visible  && visibleOnly(testimonials.items).length  > 0;
    case "contact":        return contact.visible;
    default:               return true;
  }
}

export function isSectionRenderable(id: string): boolean {
  const conf = siteConfig.sections.find((s) => s.id === id);
  if (!conf || !conf.visible) return false;
  return hasItems(id);
}

export function visibleNavSections() {
  return siteConfig.sections.filter((s) => s.visible && isSectionRenderable(s.id));
}

/** Automatic counts — never enter these manually. */
export function autoStats() {
  const cpPlatforms = visibleOnly(competitiveProgramming.platforms);
  const cpProblems = cpPlatforms.reduce(
    (sum, p) => sum + (typeof p.problemsSolved === "number" ? p.problemsSolved : 0),
    0
  );
  const cpHighestRating = cpPlatforms.reduce(
    (max, p) => (typeof p.rating === "number" && p.rating > max ? p.rating : max),
    0
  );
  return {
    projects:        visibleOnly(projects.items).length,
    publications:    visibleOnly(publications.items).length,
    certifications:  visibleOnly(certifications.items).length,
    awards:          visibleOnly(awards.items).length,
    talks:           visibleOnly(talks.items).length,
    openSource:      visibleOnly(openSource.items).length,
    achievements:    visibleOnly(achievements.items).length,
    patents:         visibleOnly(patents.items).length,
    cpProblemsSolved: cpProblems,
    cpHighestRating:  cpHighestRating,
    cpPlatformsActive: cpPlatforms.length,
  };
}

export type { SectionConfig, ResumeArchive, Project, ExperienceItem, SkillCategory, EducationItem, Publication, Certification, Achievement, ContactLink, Social, Stat, Profile, About, Experience, Projects, Skills, Education, Publications, Certifications, Achievements, Contact, SiteConfig, Timeline, TimelineItem, OpenSource, OpenSourceItem, Talks, Talk, Awards, Award, Blog, BlogPost, Startups, Startup, Products, Product, Patents, Patent, Mentoring, MentoringItem, Media, MediaItem, Testimonials, Testimonial, CompetitiveProgramming, CompetitivePlatform } from "@/data/types";
