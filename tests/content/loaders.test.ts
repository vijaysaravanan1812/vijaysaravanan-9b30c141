import { describe, it, expect } from "vitest";
import {
  siteConfig,
  profile,
  contact,
  projects,
  competitiveProgramming,
} from "@/services/content";

describe("content service loaders", () => {
  it("freezes parsed objects", () => {
    expect(Object.isFrozen(siteConfig)).toBe(true);
    expect(Object.isFrozen(profile)).toBe(true);
    expect(Object.isFrozen(contact)).toBe(true);
    expect(Object.isFrozen(projects)).toBe(true);
    expect(Object.isFrozen(competitiveProgramming)).toBe(true);
  });
  it("profile has non-empty required fields", () => {
    expect(profile.name.length).toBeGreaterThan(0);
    expect(profile.role.length).toBeGreaterThan(0);
  });
  it("contact email looks like an email", () => {
    expect(contact.email).toMatch(/.+@.+\..+/);
  });
});
