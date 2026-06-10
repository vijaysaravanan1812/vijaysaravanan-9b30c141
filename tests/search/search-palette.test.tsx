import { describe, it, expect, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, cleanup } from "@testing-library/react";
import { SearchPalette } from "@/components/SearchPalette";
import { visibleOnly, projects, competitiveProgramming } from "@/services/content";

afterEach(() => cleanup());

function open() {
  render(<SearchPalette open onOpenChange={() => {}} />);
}

describe("SearchPalette", () => {
  it("indexes visible projects", async () => {
    const user = userEvent.setup();
    open();
    const input = screen.getByPlaceholderText(/search/i);
    const firstVisible = visibleOnly(projects.items)[0];
    if (!firstVisible) return;

    const needle = firstVisible.title.split(/\s+/)[0]; // first word
    await user.type(input, needle);
    expect(document.body.textContent).toContain(needle);
    // At least one result row contains the kind label "Project"
    expect(document.body.textContent).toContain("Project");
  });

  it("does NOT surface hidden projects", async () => {
    const user = userEvent.setup();
    open();
    const hidden = projects.items.find((p) => !p.visible);
    if (!hidden) return;
    await user.type(screen.getByPlaceholderText(/search/i), hidden.title);
    expect(screen.queryAllByText(hidden.title).filter((el) => el.tagName !== "INPUT")).toHaveLength(
      0,
    );
  });

  it("shows an empty state when nothing matches", async () => {
    const user = userEvent.setup();
    open();
    await user.type(screen.getByPlaceholderText(/search/i), "zzzzzz-no-match-xyzzy");
    expect(document.body.textContent?.toLowerCase()).toMatch(/no results|nothing|no match/);
  });

  it("indexes only visible competitive-programming platforms", async () => {
    const user = userEvent.setup();
    open();
    const visiblePlatform = visibleOnly(competitiveProgramming.platforms)[0];
    if (!visiblePlatform) return;
    const needle = visiblePlatform.platform.slice(0, 4);
    await user.type(screen.getByPlaceholderText(/search/i), needle);
    expect(document.body.textContent).toContain(visiblePlatform.platform);
  });
});
