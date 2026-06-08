/**
 * Content-source abstraction. Today the app uses the JSON adapter.
 * Future adapters (CMS / HTTP API / DB) implement ContentSource and
 * the rest of the app keeps working unchanged.
 */
import * as bundled from "./content";

export type SectionKey =
  | "siteConfig" | "profile" | "about" | "experience" | "projects"
  | "skills" | "education" | "publications" | "certifications"
  | "achievements" | "contact" | "timeline" | "openSource" | "talks"
  | "awards" | "blog" | "startups" | "products" | "patents"
  | "mentoring" | "media" | "testimonials";

export interface ContentSource {
  get<K extends SectionKey>(key: K): (typeof bundled)[K];
}

export const jsonContentSource: ContentSource = {
  get: (key) => bundled[key],
};

// Single shared instance — swap implementation by reassigning here.
export const contentSource: ContentSource = jsonContentSource;
