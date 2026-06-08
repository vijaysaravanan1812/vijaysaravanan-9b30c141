import { achievements, visibleOnly } from "@/services/content";
import { Section } from "./Section";
import { Trophy } from "lucide-react";

export function Achievements() {
  if (!achievements.visible) return null;
  const items = visibleOnly(achievements.items);
  if (items.length === 0) return null;

  return (
    <Section id="achievements" eyebrow="highlights" title="Achievements">
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((a, i) => (
          <div key={i} className="rounded-lg border border-border bg-card/60 p-5">
            <Trophy className="h-5 w-5 text-accent" />
            <div className="mt-3 text-[0.7rem] tracking-[0.18em] text-muted-foreground">
              {a.category.toUpperCase()}
            </div>
            <h3 className="mt-1 text-sm font-semibold leading-snug">{a.title}</h3>
            {a.detail && (
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{a.detail}</p>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
