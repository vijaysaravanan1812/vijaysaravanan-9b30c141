import { blog, visibleOnly } from "@/services/content";
import { Section } from "./Section";
import { ExternalLink } from "lucide-react";

export function Blog() {
  if (!blog.visible) return null;
  const items = visibleOnly(blog.items);
  if (items.length === 0) return null;

  return (
    <Section id="blog" eyebrow="writing" title="Blog">
      <div className="space-y-4">
        {items.map((p, i) => (
          <article key={i} className="rounded-lg border border-border bg-card/60 p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold">{p.title}</h3>
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${p.title} link`}
                  className="text-muted-foreground hover:text-accent"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            {p.date && <div className="mt-1 text-xs text-accent">{p.date}</div>}
            {p.summary && (
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.summary}</p>
            )}
            {p.tags && p.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
