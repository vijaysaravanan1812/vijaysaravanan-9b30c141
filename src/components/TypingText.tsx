import { useEffect, useRef, useState, type CSSProperties } from "react";
import { siteConfig } from "@/services/content";

export type TypingVariant = "plain" | "chevron" | "dollar" | "prompt" | "info";

export interface TypingTextProps {
  /** Single string or list of lines to type in sequence. */
  text: string | string[];
  /** Milliseconds per character. Default from site-config (35). */
  speed?: number;
  /** Pause between lines, ms. Default from site-config (500). */
  lineDelay?: number;
  /** Show a blinking caret while typing (and after, if configured). */
  showCursor?: boolean;
  /** Keep the cursor blinking after typing finishes. Default true. */
  persistCursor?: boolean;
  /** Loop the whole animation. Default false. */
  loop?: boolean;
  /** Start typing only when scrolled into view. Default true. */
  animateOnView?: boolean;
  /** Prompt style prefix per line. Default "plain". */
  variant?: TypingVariant;
  /** Custom prefix string; overrides `variant`. */
  prefix?: string;
  /** Element to render as. Default span (or div for multi-line). */
  as?: "span" | "div" | "p";
  className?: string;
  style?: CSSProperties;
  /** Render content instantly (skip animation). */
  instant?: boolean;
  /** Called once when the full animation completes. */
  onDone?: () => void;
}

function prefixFor(variant: TypingVariant): string {
  switch (variant) {
    case "chevron": return "> ";
    case "dollar":  return "$ ";
    case "prompt":  return "vijay@portfolio:~$ ";
    case "info":    return "[INFO] ";
    default:        return "";
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Terminal-style typing animation.
 * Reveals text character-by-character, line-by-line. Respects
 * `prefers-reduced-motion` and the global `typingAnimation` flag in
 * site-config.json. Screen readers always see the final text.
 */
export function TypingText({
  text,
  speed,
  lineDelay,
  showCursor,
  persistCursor = true,
  loop = false,
  animateOnView = true,
  variant = "plain",
  prefix,
  as = "div",
  className = "",
  style,
  instant = false,
  onDone,
}: TypingTextProps) {
  const cfg = siteConfig.typingAnimation;
  const enabled = cfg?.enabled ?? true;
  const effectiveSpeed = speed ?? cfg?.speed ?? 35;
  const effectiveLineDelay = lineDelay ?? cfg?.lineDelay ?? 500;
  const effectiveShowCursor = showCursor ?? cfg?.showCursor ?? true;

  const lines = Array.isArray(text) ? text : [text];
  const finalText = lines.join("\n");
  const linePrefix = prefix ?? prefixFor(variant);

  const reduced =
    instant ||
    !enabled ||
    (typeof window !== "undefined" && prefersReducedMotion());

  const ref = useRef<HTMLElement | null>(null);
  const [started, setStarted] = useState(!animateOnView || reduced);
  const [typed, setTyped] = useState<string[]>(
    reduced ? lines.slice() : lines.map(() => "")
  );
  const [done, setDone] = useState(reduced);

  // Intersection observer — start on view.
  useEffect(() => {
    if (started) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setStarted(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  // Typing loop.
  useEffect(() => {
    if (!started || reduced) return;
    let cancelled = false;
    let lineIdx = 0;
    let charIdx = 0;

    // reset buffers when (re)starting (e.g. on loop)
    setTyped(lines.map(() => ""));
    setDone(false);

    const tick = () => {
      if (cancelled) return;
      if (lineIdx >= lines.length) {
        setDone(true);
        onDone?.();
        if (loop) {
          window.setTimeout(() => {
            if (!cancelled) {
              lineIdx = 0;
              charIdx = 0;
              setTyped(lines.map(() => ""));
              setDone(false);
              tick();
            }
          }, Math.max(effectiveLineDelay * 4, 1200));
        }
        return;
      }
      const current = lines[lineIdx];
      if (charIdx <= current.length) {
        const snapshot = current.slice(0, charIdx);
        setTyped((prev) => {
          const next = prev.slice();
          next[lineIdx] = snapshot;
          return next;
        });
        charIdx += 1;
        window.setTimeout(tick, effectiveSpeed);
      } else {
        lineIdx += 1;
        charIdx = 0;
        window.setTimeout(tick, effectiveLineDelay);
      }
    };

    const startId = window.setTimeout(tick, 60);
    return () => {
      cancelled = true;
      window.clearTimeout(startId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, reduced, finalText, effectiveSpeed, effectiveLineDelay, loop]);

  const Tag = as as "div";
  const showCaret = effectiveShowCursor && !reduced && (persistCursor || !done);

  // Active (currently-typing) line index. After completion, caret sits on last line.
  const activeIdx = reduced || done
    ? typed.length - 1
    : (() => {
        for (let i = 0; i < typed.length; i++) {
          if (typed[i].length < lines[i].length) return i;
        }
        return typed.length - 1;
      })();

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={style}
    >
      <span aria-hidden={!reduced}>
        {typed.map((seg, i) => {
          if (!reduced && i > activeIdx) return null;
          return (
            <span key={i} className="block">
              {linePrefix && (
                <span className="text-accent select-none">{linePrefix}</span>
              )}
              <span>{seg}</span>
              {i === activeIdx && showCaret && <Caret />}
            </span>
          );
        })}
      </span>
      {!reduced && <span className="sr-only">{finalText}</span>}
    </Tag>
  );
}

function Caret() {
  return (
    <span
      aria-hidden
      className="inline-block w-[0.55em] h-[1em] translate-y-[2px] ml-0.5 bg-accent align-middle animate-pulse"
      style={{ animationDuration: "1s" }}
    />
  );
}

export default TypingText;
