import { openSource, visibleOnly } from "@/services/content";
import { Section } from "./Section";
import { Github, ExternalLink } from "lucide-react";

export function OpenSource() {
  if (!openSource.visible) return null;
  const items = visibleOnly(openSource.items);
  if (items.length === 0) return null;

  return (
    <Section id="open-source" eyebrow="contributions" title="Open Source">
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((c, i) => (
          <div key={i} className="rounded-lg border border-border bg-card/60 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold">{c.project}</h3>
                {c.repository && (
                  <div className="mt-0.5 text-xs text-muted-foreground">{c.repository}</div>
                )}
              </div>
              {c.url && (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${c.project} link`}
                  className="text-muted-foreground hover:text-accent"
                >
                  {/^https?:\/\/github\.com/i.test(c.url) ? (
                    <Github className="h-4 w-4" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                </a>
              )}
            </div>
            {c.description && (
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{c.description}</p>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
