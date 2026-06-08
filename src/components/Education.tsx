import { education, visibleOnly } from "@/services/content";
import { Section } from "./Section";

export function Education() {
  if (!education.visible) return null;
  const items = visibleOnly(education.items);
  if (items.length === 0) return null;

  return (
    <Section id="education" eyebrow="academia" title="Education">
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((e, i) => (
          <div key={i} className="rounded-lg border border-border bg-card/60 p-6">
            <h3 className="text-base font-semibold">{e.institution}</h3>
            <div className="mt-1 text-sm text-muted-foreground">{e.degree}</div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>{e.duration}</span>
              <span className="text-accent">{e.grade}</span>
            </div>
            {e.location && (
              <div className="mt-1 text-xs text-muted-foreground/70">{e.location}</div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
