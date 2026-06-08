import { describe, it, expect, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { Nav } from "@/components/Nav";
import { visibleNavSections, siteConfig } from "@/services/content";

afterEach(() => cleanup());

describe("Nav component — menu generation & interaction", () => {
  it("renders hamburger button, search and theme toggle", () => {
    render(<Nav />);
    expect(screen.getAllByLabelText(/open navigation menu/i).length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText(/search/i).length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText(/toggle theme/i).length).toBeGreaterThan(0);
  });

  it("opens the hamburger menu and lists every visible nav section in order", async () => {
    render(<Nav />);
    fireEvent.click(screen.getAllByLabelText(/open navigation menu/i)[0]);

    const labels = visibleNavSections().map((s) => s.label);
    await waitFor(() => {
      expect(document.body.textContent).toContain("Navigation");
    });
    for (const label of labels) {
      expect(document.body.textContent).toContain(label);
    }
  });

  it("never includes site-config sections marked visible:false", async () => {
    render(<Nav />);
    fireEvent.click(screen.getAllByLabelText(/open navigation menu/i)[0]);
    await waitFor(() => expect(document.body.textContent).toContain("Navigation"));

    const hidden = siteConfig.sections.filter((s) => !s.visible).map((s) => s.label);
    for (const label of hidden) {
      expect(document.body.textContent).not.toContain(label);
    }
  });

  it("closes the menu when the ESC key is pressed", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    fireEvent.click(screen.getAllByLabelText(/open navigation menu/i)[0]);
    await waitFor(() => expect(document.body.textContent).toContain("Navigation"));

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(document.querySelector('[data-state="open"][role="dialog"]')).toBeNull();
    });
  });

  it("scrolls and closes menu on nav link click (smooth navigation)", async () => {
    render(<Nav />);
    fireEvent.click(screen.getAllByLabelText(/open navigation menu/i)[0]);
    await waitFor(() => expect(document.body.textContent).toContain("Navigation"));

    // Provide a target so scrollIntoView is exercised
    const section = document.createElement("section");
    section.id = "about";
    section.scrollIntoView = () => {};
    document.body.appendChild(section);

    const aboutLink = screen.getAllByText("About")[0];
    fireEvent.click(aboutLink);

    // After click, dialog should be closing (open state cleared)
    await waitFor(() => {
      expect(document.querySelector('[data-state="open"][role="dialog"]')).toBeNull();
    });
    section.remove();
  });
});
