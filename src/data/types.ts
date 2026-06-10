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
} from "./schema";

// Root file types (inferred from Zod) ─────────────────────────
export type SiteConfig = z.infer<typeof siteConfigSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type About = z.infer<typeof aboutSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Projects = z.infer<typeof projectsSchema>;
export type Skills = z.infer<typeof skillsSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Publications = z.infer<typeof publicationsSchema>;
export type Certifications = z.infer<typeof certificationsSchema>;
export type Achievements = z.infer<typeof achievementsSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type Timeline = z.infer<typeof timelineSchema>;
export type OpenSource = z.infer<typeof openSourceSchema>;
export type Talks = z.infer<typeof talksSchema>;
export type Awards = z.infer<typeof awardsSchema>;
export type Blog = z.infer<typeof blogSchema>;
export type Startups = z.infer<typeof startupsSchema>;
export type Products = z.infer<typeof productsSchema>;
export type Patents = z.infer<typeof patentsSchema>;
export type Mentoring = z.infer<typeof mentoringSchema>;
export type Media = z.infer<typeof mediaSchema>;
export type Testimonials = z.infer<typeof testimonialsSchema>;
export type CompetitiveProgramming = z.infer<typeof competitiveProgrammingSchema>;
export type CompetitivePlatform = CompetitiveProgramming["platforms"][number];

// Convenience item types ──────────────────────────────────────
export type SectionConfig = SiteConfig["sections"][number];
export type ResumeArchive = NonNullable<SiteConfig["resumeArchive"]>[number];
export type Social = Profile["socials"][number];
export type Stat = Profile["stats"][number];
export type ExperienceItem = Experience["items"][number];
export type Project = Projects["items"][number];
export type SkillCategory = Skills["categories"][number];
export type EducationItem = Education["items"][number];
export type Publication = Publications["items"][number];
export type Certification = Certifications["items"][number];
export type Achievement = Achievements["items"][number];
export type ContactLink = Contact["links"][number];
export type TimelineItem = Timeline["items"][number];
export type OpenSourceItem = OpenSource["items"][number];
export type Talk = Talks["items"][number];
export type Award = Awards["items"][number];
export type BlogPost = Blog["items"][number];
export type Startup = Startups["items"][number];
export type Product = Products["items"][number];
export type Patent = Patents["items"][number];
export type MentoringItem = Mentoring["items"][number];
export type MediaItem = Media["items"][number];
export type Testimonial = Testimonials["items"][number];

// Anything carrying the visibility flag
export type Visible<T> = T & { visible: boolean };
export type Featurable<T> = T & { visible: boolean; featured?: boolean };
