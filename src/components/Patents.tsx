import { patents, visibleOnly } from "@/services/content";
import { Section } from "./Section";
import { ExternalLink, FileText } from "lucide-react";

export function Patents() {
  if (!patents.visible) return null;
  const items = visibleOnly(patents.items);
  if (items.length === 0) return null;
  return (
    <Section id="patents" eyebrow="ip" title="Patents">
      <div className="space-y-4">
        {items.map((p, i) => (
          <div key={i} className="rounded-lg border border-border bg-card/60 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 mt-1 text-accent" />
                <div>
                  <h3 className="text-sm font-semibold">{p.title}</h3>
                  <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                    {p.number && <span>{p.number}</span>}
                    {p.year && <span className="text-accent">{p.year}</span>}
                  </div>
                </div>
              </div>
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={p.title}
                  className="text-muted-foreground hover:text-accent"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            {p.detail && (
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{p.detail}</p>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
