import { media, visibleOnly } from "@/services/content";
import { Section } from "./Section";
import { ExternalLink } from "lucide-react";

export function Media() {
  if (!media.visible) return null;
  const items = visibleOnly(media.items);
  if (items.length === 0) return null;
  return (
    <Section id="media" eyebrow="press" title="Media Coverage">
      <div className="space-y-3">
        {items.map((m, i) => (
          <a
            key={i}
            href={m.url || "#"}
            target={m.url ? "_blank" : undefined}
            rel="noreferrer"
            className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card/60 p-4 transition hover:border-accent/50"
          >
            <div>
              <div className="text-sm font-semibold">{m.title}</div>
              <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                {m.outlet && <span className="text-accent">{m.outlet}</span>}
                {m.date && <span>{m.date}</span>}
              </div>
            </div>
            {m.url && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
          </a>
        ))}
      </div>
    </Section>
  );
}
