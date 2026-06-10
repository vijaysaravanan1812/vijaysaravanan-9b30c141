import { skills, visibleOnly } from "@/services/content";
import { Section } from "./Section";

export function Skills() {
  if (!skills.visible) return null;
  const cats = visibleOnly(skills.categories).filter((c) => c.items.length > 0);
  if (cats.length === 0) return null;

  return (
    <Section id="skills" eyebrow="stack" title="Technical Arsenal">
      <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
        {cats.map((c) => (
          <div key={c.name} className="bg-card p-6">
            <div className="text-xs tracking-[0.18em] text-muted-foreground">
              <span className="text-accent">//</span> {c.name.toUpperCase()}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {c.items.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
