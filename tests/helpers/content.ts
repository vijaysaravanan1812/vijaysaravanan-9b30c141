/**
 * Shared test helpers for content/visibility/navigation tests.
 * Keep these framework-agnostic so any test file can import them.
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

export const FIXTURE_DIR = path.resolve(__dirname, "../fixtures");
export const DATA_DIR = path.resolve(__dirname, "../../src/data");
export const TEMPLATE_DIR = path.resolve(__dirname, "../../public/templates");

export function readFixture<T = unknown>(name: string): T {
  return JSON.parse(readFileSync(path.join(FIXTURE_DIR, name), "utf8")) as T;
}

export function readDataFile<T = unknown>(name: string): T {
  return JSON.parse(readFileSync(path.join(DATA_DIR, name), "utf8")) as T;
}

export function listDataFiles(): string[] {
  return readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
}

export function listTemplates(): string[] {
  return readdirSync(TEMPLATE_DIR).filter((f) => f.endsWith(".json") && !f.startsWith("_"));
}

export function makeItem(visible: boolean, extra: Record<string, unknown> = {}) {
  return { visible, ...extra };
}

export function makeSectionConfig(
  overrides: Partial<{ id: string; label: string; visible: boolean }> = {},
) {
  return { id: "test", label: "Test", visible: true, ...overrides };
}
