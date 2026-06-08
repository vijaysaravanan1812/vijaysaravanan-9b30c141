/**
 * Rendering helpers that wrap React Testing Library with the conventions
 * used across the tests/ suite (cleanup-after-each is configured globally
 * by RTL when imported via @testing-library/react in jsdom).
 */
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";

export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(ui, options);
}

export * from "@testing-library/react";
