import { startups, visibleOnly } from "@/services/content";
import { Section } from "./Section";
import { ExternalLink } from "lucide-react";

export function Startups() {
  if (!startups.visible) return null;
  const items = visibleOnly(startups.items);
  if (items.length === 0) return null;
  return (
    <Section id="startups" eyebrow="ventures" title="Startups">
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((s, i) => (
          <div key={i} className="rounded-lg border border-border bg-card/60 p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold">{s.name}</h3>
              {s.url && <a href={s.url} target="_blank" rel="noreferrer" aria-label={s.name} className="text-muted-foreground hover:text-accent"><ExternalLink className="h-4 w-4" /></a>}
            </div>
            <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
              {s.role && <span className="text-accent">{s.role}</span>}
              {s.duration && <span>{s.duration}</span>}
            </div>
            {s.tagline && <p className="mt-2 text-sm">{s.tagline}</p>}
            {s.detail && <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{s.detail}</p>}
          </div>
        ))}
      </div>
    </Section>
  );
}
