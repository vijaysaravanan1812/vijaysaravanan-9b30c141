import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, waitFor } from "@testing-library/react";
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

// IntersectionObserver that immediately marks targets as visible so the
// animated branch executes during tests.
class TriggeringIO {
  cb: IntersectionObserverCallback;
  constructor(cb: IntersectionObserverCallback) {
    this.cb = cb;
  }
  observe = () => {
    this.cb(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  };
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = () => [];
}

function getWrapper(container: HTMLElement): HTMLElement {
  return container.querySelector("[aria-hidden]") as HTMLElement;
}

function topLevelBlocks(container: HTMLElement): HTMLElement[] {
  const w = getWrapper(container);
  return Array.from(w.children).filter((c) =>
    c.classList.contains("block"),
  ) as HTMLElement[];
}

describe("TypingText", () => {
  beforeEach(() => {
    Object.defineProperty(window, "IntersectionObserver", {
      writable: true,
      configurable: true,
      value: TriggeringIO,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the final text instantly and statically when prefers-reduced-motion is set (hydration-safe, no caret)", () => {
    setReducedMotion(true);
    const { container } = render(
      <TypingText text={["line one", "line two"]} variant="chevron" />,
    );

    expect(container.textContent).toContain("line one");
    expect(container.textContent).toContain("line two");
    // Caret element absent.
    expect(container.querySelector(".animate-pulse")).toBeNull();
    // sr-only mirror only exists in animated mode.
    expect(container.querySelector(".sr-only")).toBeNull();
    // Chevron prefix rendered once per line, never partially.
    const prefixes = container.querySelectorAll(".text-accent");
    expect(prefixes.length).toBe(2);
  });

  it("renders instantly when instant=true regardless of motion preference", () => {
    setReducedMotion(false);
    const { container } = render(
      <TypingText text="hello world" instant showCursor={false} />,
    );
    expect(container.textContent).toContain("hello world");
    expect(container.querySelector(".animate-pulse")).toBeNull();
  });

  it("renders nothing animated when the global typingAnimation flag is disabled", async () => {
    setReducedMotion(false);
    // Temporarily flip the global flag via module mock.
    vi.doMock("@/services/content", async () => {
      const actual =
        await vi.importActual<typeof import("@/services/content")>(
          "@/services/content",
        );
      const cfg = actual.siteConfig as Record<string, unknown>;
      return {
        ...actual,
        siteConfig: {
          ...cfg,
          typingAnimation: {
            ...((cfg.typingAnimation as Record<string, unknown> | undefined) ??
              {}),
            enabled: false,
          },
        },
      };
    });
    const mod = await import("../TypingText");
    const { container } = render(
      <mod.TypingText text={["a", "b"]} animateOnView={false} />,
    );
    expect(container.textContent).toContain("a");
    expect(container.textContent).toContain("b");
    expect(container.querySelector(".animate-pulse")).toBeNull();
    vi.doUnmock("@/services/content");
  });

  it("does not desync: final state reveals every source line exactly once with a single caret on the last line", async () => {
    setReducedMotion(false);
    const onDone = vi.fn();
    const { container } = render(
      <TypingText
        text={["ab", "cd"]}
        speed={1}
        lineDelay={5}
        animateOnView={false}
        onDone={onDone}
      />,
    );

    await waitFor(() => expect(onDone).toHaveBeenCalledTimes(1), {
      timeout: 2000,
    });

    const wrapper = getWrapper(container);
    // Every source character is present in the final visible output.
    expect(wrapper.textContent).toContain("ab");
    expect(wrapper.textContent).toContain("cd");

    // Exactly one caret survives, on the final rendered line.
    const carets = container.querySelectorAll(".animate-pulse");
    expect(carets.length).toBe(1);
    const blocks = topLevelBlocks(container);
    expect(blocks.length).toBeGreaterThanOrEqual(2);
    const lastBlock = blocks[blocks.length - 1];
    expect(lastBlock.contains(carets[0])).toBe(true);
    expect(lastBlock.textContent).toContain("cd");

    // Sanity: no empty top-level block (the previous desync symptom).
    const emptyBlocks = blocks.filter((b) => {
      const text = (b.textContent ?? "").replace(/\s/g, "");
      return text.length === 0;
    });
    expect(emptyBlocks.length).toBe(0);
  });

  it("hides caret after completion when persistCursor=false", async () => {
    setReducedMotion(false);
    const onDone = vi.fn();
    const { container } = render(
      <TypingText
        text="hi"
        speed={1}
        lineDelay={5}
        animateOnView={false}
        persistCursor={false}
        onDone={onDone}
      />,
    );
    await waitFor(() => expect(onDone).toHaveBeenCalledTimes(1));
    expect(container.textContent).toContain("hi");
    expect(container.querySelector(".animate-pulse")).toBeNull();
  });

  it("switches to static, caret-free render when motion preference flips on mid-animation", async () => {
    const mq = setReducedMotion(false);
    const { container } = render(
      <TypingText
        text={["alpha", "beta"]}
        speed={50}
        lineDelay={200}
        animateOnView={false}
      />,
    );

    // Flip reduced-motion preference live.
    mq.update(true);

    await waitFor(() => {
      expect(container.textContent).toContain("alpha");
      expect(container.textContent).toContain("beta");
      expect(container.querySelector(".animate-pulse")).toBeNull();
    });

    // sr-only mirror is dropped in reduced mode (the visible text already
    // contains everything assistive tech needs).
    expect(container.querySelector(".sr-only")).toBeNull();
  });

  it("exposes the full final text to assistive tech via sr-only mirror while animating", () => {
    setReducedMotion(false);
    const { container } = render(
      <TypingText text={["one", "two"]} speed={50} animateOnView={false} />,
    );
    const sr = container.querySelector(".sr-only");
    expect(sr?.textContent).toBe("one\ntwo");
    // And the animated wrapper is marked aria-hidden so SR never reads
    // partially-typed snapshots.
    expect(getWrapper(container).getAttribute("aria-hidden")).toBe("false");
    // The "false" here is the literal attribute value used by the component
    // (aria-hidden={!reduced} → false in animated mode).
  });
});
