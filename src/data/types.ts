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
} from "./schema";

// ---- Root file types (inferred from Zod) ----
export type SiteConfig    = z.infer<typeof siteConfigSchema>;
export type Profile       = z.infer<typeof profileSchema>;
export type About         = z.infer<typeof aboutSchema>;
export type Experience    = z.infer<typeof experienceSchema>;
export type Projects      = z.infer<typeof projectsSchema>;
export type Skills        = z.infer<typeof skillsSchema>;
export type Education     = z.infer<typeof educationSchema>;
export type Publications  = z.infer<typeof publicationsSchema>;
export type Certifications = z.infer<typeof certificationsSchema>;
export type Achievements  = z.infer<typeof achievementsSchema>;
export type Contact       = z.infer<typeof contactSchema>;

// ---- Convenience item types ----
export type SectionConfig  = SiteConfig["sections"][number];
export type Social         = Profile["socials"][number];
export type Stat           = Profile["stats"][number];
export type ExperienceItem = Experience["items"][number];
export type Project        = Projects["items"][number];
export type SkillCategory  = Skills["categories"][number];
export type EducationItem  = Education["items"][number];
export type Publication    = Publications["items"][number];
export type Certification  = Certifications["items"][number];
export type Achievement    = Achievements["items"][number];
export type ContactLink    = Contact["links"][number];

// Anything carrying the visibility flag
export type Visible<T> = T & { visible: boolean };
