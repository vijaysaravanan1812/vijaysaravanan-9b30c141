import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { TypingText } from "../TypingText";

// Helper to control prefers-reduced-motion.
function setReducedMotion(matches: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const mql = {
    matches,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) =>
      listeners.add(cb),
    removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) =>
      listeners.delete(cb),
    dispatchEvent: vi.fn(),
  };
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn(() => mql),
  });
  return {
    update(next: boolean) {
      mql.matches = next;
      listeners.forEach((cb) =>
        cb({ matches: next } as unknown as MediaQueryListEvent),
      );
    },
  };
}

// Trigger any registered IntersectionObserver so animated path runs.
class TriggeringIO {
  static instances: TriggeringIO[] = [];
  cb: IntersectionObserverCallback;
  constructor(cb: IntersectionObserverCallback) {
    this.cb = cb;
    TriggeringIO.instances.push(this);
  }
  observe = () => {
    // immediately mark visible
    this.cb(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  };
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = () => [];
}

describe("TypingText", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(window, "IntersectionObserver", {
      writable: true,
      configurable: true,
      value: TriggeringIO,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
    TriggeringIO.instances = [];
  });

  it("renders final text instantly when prefers-reduced-motion is set (hydration-safe, no caret)", () => {
    setReducedMotion(true);
    const { container } = render(
      <TypingText text={["line one", "line two"]} variant="chevron" />,
    );
    // After the effect synchronously sets reduced state.
    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(container.textContent).toContain("line one");
    expect(container.textContent).toContain("line two");
    // No animated caret element.
    expect(container.querySelector(".animate-pulse")).toBeNull();
    // sr-only duplicate is only emitted in animated mode.
    expect(container.querySelector(".sr-only")).toBeNull();
  });

  it("renders instantly when instant=true regardless of motion preference", () => {
    setReducedMotion(false);
    const { container } = render(
      <TypingText text="hello world" instant showCursor={false} />,
    );
    act(() => {
      vi.runOnlyPendingTimers();
    });
    expect(container.textContent).toContain("hello world");
    expect(container.querySelector(".animate-pulse")).toBeNull();
  });

  it("types character-by-character and keeps caret on the active line (no desync to empty trailing line)", () => {
    setReducedMotion(false);
    const { container } = render(
      <TypingText
        text={["ab", "cd"]}
        speed={10}
        lineDelay={20}
        animateOnView={false}
      />,
    );

    // initial start delay (60ms) + a few ticks into line 0
    act(() => {
      vi.advanceTimersByTime(60 + 10);
    });
    // While typing line 0, only line 0 should be rendered, with caret on it.
    let blocks = container.querySelectorAll("span.block");
    expect(blocks.length).toBe(1);
    expect(blocks[0].querySelector(".animate-pulse")).not.toBeNull();

    // Finish entire animation
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    blocks = container.querySelectorAll("span.block");
    // Both lines rendered exactly once — no extra empty trailing block.
    expect(blocks.length).toBe(2);
    expect(blocks[0].textContent).toContain("ab");
    expect(blocks[1].textContent).toContain("cd");

    // Caret persists on the LAST line only, not on a phantom extra line.
    const carets = container.querySelectorAll(".animate-pulse");
    expect(carets.length).toBe(1);
    expect(blocks[1].contains(carets[0])).toBe(true);
  });

  it("hides caret after completion when persistCursor=false", () => {
    setReducedMotion(false);
    const { container } = render(
      <TypingText
        text="hi"
        speed={5}
        animateOnView={false}
        persistCursor={false}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(container.textContent).toContain("hi");
    expect(container.querySelector(".animate-pulse")).toBeNull();
  });

  it("switches to static render when motion preference changes mid-animation", () => {
    const mq = setReducedMotion(false);
    const { container } = render(
      <TypingText
        text={["alpha", "beta"]}
        speed={20}
        lineDelay={50}
        animateOnView={false}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(80);
    });
    expect(container.querySelector(".animate-pulse")).not.toBeNull();

    // User flips reduced motion on.
    act(() => {
      mq.update(true);
      vi.runOnlyPendingTimers();
    });

    // Both lines fully rendered, caret gone.
    expect(container.textContent).toContain("alpha");
    expect(container.textContent).toContain("beta");
    expect(container.querySelector(".animate-pulse")).toBeNull();
  });

  it("exposes the full final text to assistive tech via sr-only mirror while animating", () => {
    setReducedMotion(false);
    const { container } = render(
      <TypingText
        text={["one", "two"]}
        speed={50}
        animateOnView={false}
      />,
    );
    const sr = container.querySelector(".sr-only");
    expect(sr?.textContent).toBe("one\ntwo");
  });
});
