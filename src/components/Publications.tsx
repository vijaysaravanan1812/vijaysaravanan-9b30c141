import { publications, visibleOnly } from "@/services/content";
import { Section } from "./Section";
import { ExternalLink } from "lucide-react";

export function Publications() {
  if (!publications.visible) return null;
  const items = visibleOnly(publications.items);
  if (items.length === 0) return null;

  return (
    <Section id="publications" eyebrow="research" title="Publications">
      <div className="space-y-4">
        {items.map((p, i) => (
          <div key={i} className="rounded-lg border border-border bg-card/60 p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold">{p.title}</h3>
              {p.link && (
                <a href={p.link} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-accent">
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            {p.authors && <div className="mt-1 text-sm text-muted-foreground">{p.authors}</div>}
            <div className="mt-2 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
              {p.venue && <span className="text-accent">{p.venue}</span>}
              {p.year && <span>{p.year}</span>}
              {p.doi && <span>DOI: {p.doi}</span>}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
