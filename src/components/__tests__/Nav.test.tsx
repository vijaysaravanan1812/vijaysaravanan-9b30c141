/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Nav } from "@/components/Nav";
import { visibleNavSections } from "@/services/content";

describe("Nav component", () => {
  beforeEach(() => {
    // Reset scroll position
    window.scrollY = 0;
  });

  it("renders the hamburger menu button", () => {
    render(<Nav />);
    expect(screen.getByLabelText(/open navigation menu/i)).toBeInTheDocument();
  });

  it("renders search and theme toggle buttons", () => {
    render(<Nav />);
    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/toggle theme/i)).toBeInTheDocument();
  });

  it("renders only visible nav sections inside the menu panel", async () => {
    render(<Nav />);

    const menuButton = screen.getByLabelText(/open navigation menu/i);
    fireEvent.click(menuButton);

    const navSections = visibleNavSections();
    const hiddenSectionIds = [
      "startups",
      "products",
      "patents",
      "mentoring",
      "media",
      "testimonials",
    ];

    for (const section of navSections) {
      await waitFor(() => {
        expect(screen.getByText(section.label)).toBeInTheDocument();
      });
    }

    for (const id of hiddenSectionIds) {
      // The section should not appear as a nav link
      expect(screen.queryByRole("link", { name: new RegExp(id, "i") })).not.toBeInTheDocument();
    }
  });

  it("does not render hidden sections such as Startups, Products, Patents", async () => {
    render(<Nav />);

    const menuButton = screen.getByLabelText(/open navigation menu/i);
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByText("Navigation")).toBeInTheDocument();
    });

    expect(screen.queryByText("Startups")).not.toBeInTheDocument();
    expect(screen.queryByText("Products")).not.toBeInTheDocument();
    expect(screen.queryByText("Patents")).not.toBeInTheDocument();
    expect(screen.queryByText("Mentoring")).not.toBeInTheDocument();
    expect(screen.queryByText("Media")).not.toBeInTheDocument();
    expect(screen.queryByText("Testimonials")).not.toBeInTheDocument();
  });

  it("renders the expected visible sections in order", async () => {
    render(<Nav />);

    const menuButton = screen.getByLabelText(/open navigation menu/i);
    fireEvent.click(menuButton);

    const expectedLabels = [
      "About",
      "Experience",
      "Projects",
      "Skills",
      "Competitive Programming",
      "Education",
      "Publications",
      "Certifications",
      "Achievements",
      "Timeline",
      "Open Source",
      "Talks",
      "Awards",
      "Blog",
      "Contact",
    ];

    for (const label of expectedLabels) {
      await waitFor(() => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    }
  });

  it("closes the menu when a nav link is clicked", async () => {
    render(<Nav />);

    const menuButton = screen.getByLabelText(/open navigation menu/i);
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByText("Navigation")).toBeInTheDocument();
    });

    const aboutLink = screen.getByText("About");
    fireEvent.click(aboutLink);

    await waitFor(() => {
      expect(screen.queryByText("Navigation")).not.toBeInTheDocument();
    });
  });
});
