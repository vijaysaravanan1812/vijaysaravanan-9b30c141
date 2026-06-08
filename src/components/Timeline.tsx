import { timeline, visibleOnly } from "@/services/content";
import { Section } from "./Section";

export function Timeline() {
  if (!timeline.visible) return null;
  const items = visibleOnly(timeline.items).slice().sort((a, b) => {
    const ay = Number(a.year) || 0;
    const by = Number(b.year) || 0;
    return by - ay;
  });
  if (items.length === 0) return null;

  return (
    <Section id="timeline" eyebrow="career" title="Timeline">
      <ol className="relative border-l border-border pl-6">
        {items.map((t, i) => (
          <li key={i} className="mb-8 last:mb-0">
            <span className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
            <div className="text-[0.7rem] tracking-[0.2em] text-accent">{t.year}</div>
            <h3 className="mt-1 text-base font-semibold">{t.title}</h3>
            {t.description && (
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {t.description}
              </p>
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}
