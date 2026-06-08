import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup, screen, fireEvent, waitFor } from "@testing-library/react";
import { Nav } from "@/components/Nav";
import { siteConfig } from "@/services/content";

afterEach(() => cleanup());

describe("integration — site-config visibility flows through to rendered Nav", () => {
  it("rendered menu labels equal the set of visible+renderable site-config labels", async () => {
    render(<Nav />);
    fireEvent.click(screen.getAllByLabelText(/open navigation menu/i)[0]);
    await waitFor(() => expect(document.body.textContent).toContain("Navigation"));

    for (const s of siteConfig.sections) {
      if (s.visible) continue;
      expect(document.body.textContent).not.toContain(s.label);
    }
  });
});
