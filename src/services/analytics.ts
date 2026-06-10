/**
 * Analytics shim. No-op unless siteConfig.analyticsEnabled === true.
 * Replace `track` with a real provider call when you add one.
 */
import { siteConfig } from "./content";

export function track(event: string, props?: Record<string, unknown>) {
  if (!siteConfig.analyticsEnabled) return;
  // Hook your provider here (Plausible, PostHog, GA). Console for now.
  console.info("[analytics]", event, props ?? {});
}

export function isAnalyticsEnabled(): boolean {
  return siteConfig.analyticsEnabled === true;
}
