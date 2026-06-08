import { awards, visibleOnly } from "@/services/content";
import { Section } from "./Section";
import { Award as AwardIcon } from "lucide-react";

export function Awards() {
  if (!awards.visible) return null;
  const items = visibleOnly(awards.items);
  if (items.length === 0) return null;

  return (
    <Section id="awards" eyebrow="recognition" title="Awards">
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((a, i) => (
          <div key={i} className="rounded-lg border border-border bg-card/60 p-5">
            <AwardIcon className="h-5 w-5 text-accent" />
            <h3 className="mt-3 text-sm font-semibold">{a.title}</h3>
            <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
              {a.issuer && <span>{a.issuer}</span>}
              {a.year && <span className="text-accent">{a.year}</span>}
            </div>
            {a.detail && <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{a.detail}</p>}
          </div>
        ))}
      </div>
    </Section>
  );
}
