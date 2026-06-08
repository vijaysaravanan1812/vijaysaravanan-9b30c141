import { describe, it, expect, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, cleanup } from "@testing-library/react";
import { SearchPalette } from "@/components/SearchPalette";
import {
  visibleOnly,
  projects,
  competitiveProgramming,
} from "@/services/content";

afterEach(() => cleanup());

function open() {
  render(<SearchPalette open onClose={() => {}} />);
}

describe("SearchPalette", () => {
  it("renders when open and indexes visible projects", async () => {
    const user = userEvent.setup();
    open();
    const input = screen.getByPlaceholderText(/search/i);
    const firstVisible = visibleOnly(projects.items)[0];
    if (firstVisible) {
      await user.type(input, firstVisible.title.slice(0, 4));
      expect(screen.getAllByText(firstVisible.title).length).toBeGreaterThan(0);
    }
  });

  it("does NOT surface hidden projects", async () => {
    const user = userEvent.setup();
    open();
    const hidden = projects.items.find((p) => !p.visible);
    if (hidden) {
      await user.type(screen.getByPlaceholderText(/search/i), hidden.title);
      // hidden titles must not appear in the results list
      expect(
        screen.queryAllByText(hidden.title).filter((el) => el.tagName !== "INPUT")
      ).toHaveLength(0);
    }
  });

  it("shows an empty state when nothing matches", async () => {
    const user = userEvent.setup();
    open();
    await user.type(
      screen.getByPlaceholderText(/search/i),
      "zzzzzz-no-match-string-xyzzy"
    );
    expect(document.body.textContent?.toLowerCase()).toMatch(/no results|nothing|no match/);
  });

  it("indexes only visible competitive-programming platforms", async () => {
    const user = userEvent.setup();
    open();
    const visiblePlatform = visibleOnly(competitiveProgramming.platforms)[0];
    if (visiblePlatform) {
      await user.type(screen.getByPlaceholderText(/search/i), visiblePlatform.platform);
      expect(screen.getAllByText(new RegExp(visiblePlatform.platform, "i")).length).toBeGreaterThan(0);
    }
  });
});
