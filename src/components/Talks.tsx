import { talks, visibleOnly } from "@/services/content";
import { Section } from "./Section";
import { ExternalLink, Mic } from "lucide-react";

export function Talks() {
  if (!talks.visible) return null;
  const items = visibleOnly(talks.items);
  if (items.length === 0) return null;

  return (
    <Section id="talks" eyebrow="speaking" title="Talks & Presentations">
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((t, i) => (
          <div key={i} className="rounded-lg border border-border bg-card/60 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Mic className="h-4 w-4 mt-1 text-accent" />
                <div>
                  <h3 className="text-sm font-semibold">{t.title}</h3>
                  <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                    {t.kind && <span className="text-accent">{t.kind}</span>}
                    {t.venue && <span>{t.venue}</span>}
                    {t.date && <span>{t.date}</span>}
                  </div>
                </div>
              </div>
              {t.url && (
                <a href={t.url} target="_blank" rel="noreferrer" aria-label={`${t.title} link`} className="text-muted-foreground hover:text-accent">
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            {t.description && (
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{t.description}</p>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
