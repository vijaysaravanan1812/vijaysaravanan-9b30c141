import { mentoring, visibleOnly } from "@/services/content";
import { Section } from "./Section";

export function Mentoring() {
  if (!mentoring.visible) return null;
  const items = visibleOnly(mentoring.items);
  if (items.length === 0) return null;
  return (
    <Section id="mentoring" eyebrow="community" title="Mentoring">
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((m, i) => (
          <div key={i} className="rounded-lg border border-border bg-card/60 p-5">
            <h3 className="text-sm font-semibold">{m.program}</h3>
            <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
              {m.role && <span className="text-accent">{m.role}</span>}
              {m.duration && <span>{m.duration}</span>}
            </div>
            {m.detail && <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{m.detail}</p>}
          </div>
        ))}
      </div>
    </Section>
  );
}
