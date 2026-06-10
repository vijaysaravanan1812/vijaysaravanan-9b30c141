import { experience, visibleOnly } from "@/services/content";
import { Section } from "./Section";

export function Experience() {
  if (!experience.visible) return null;
  const items = visibleOnly(experience.items);
  if (items.length === 0) return null;

  return (
    <Section id="experience" eyebrow="career" title="Experience">
      <div className="relative pl-6 md:pl-8">
        <div className="absolute left-1.5 top-2 bottom-2 w-px bg-border md:left-2.5" />
        <div className="space-y-12">
          {items.map((item, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[1.35rem] top-2 h-3 w-3 rounded-full bg-accent shadow-[0_0_0_4px] shadow-accent/15 md:-left-[1.75rem]" />
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
                <h3 className="text-lg font-semibold">
                  {item.position} <span className="text-accent">→ {item.company}</span>
                </h3>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {item.duration}
                </span>
              </div>
              {item.location && (
                <div className="mt-1 text-xs text-muted-foreground">{item.location}</div>
              )}
              <ul className="mt-4 space-y-2">
                {item.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="relative pl-5 text-sm leading-relaxed text-muted-foreground before:absolute before:left-0 before:top-2 before:h-1 before:w-1 before:rounded-full before:bg-accent/60"
                  >
                    {h}
                  </li>
                ))}
              </ul>
              {item.stack &&
                item.stack.length > 0 &&
                (() => {
                  const stack = item.stack;
                  return (
                    <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-xs text-muted-foreground/70">Stack:</span>
                      {stack.map((t, i) => (
                        <span key={t} className="text-xs text-accent">
                          {t}
                          {i < stack.length - 1 && (
                            <span className="ml-2 text-muted-foreground/40">·</span>
                          )}
                        </span>
                      ))}
                    </div>
                  );
                })()}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
