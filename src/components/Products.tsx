import { products, visibleOnly } from "@/services/content";
import { Section } from "./Section";
import { ExternalLink } from "lucide-react";

export function Products() {
  if (!products.visible) return null;
  const items = visibleOnly(products.items);
  if (items.length === 0) return null;
  return (
    <Section id="products" eyebrow="shipped" title="Products">
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((p, i) => (
          <div key={i} className="rounded-lg border border-border bg-card/60 p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold">{p.name}</h3>
              {p.url && <a href={p.url} target="_blank" rel="noreferrer" aria-label={p.name} className="text-muted-foreground hover:text-accent"><ExternalLink className="h-4 w-4" /></a>}
            </div>
            {p.tagline && <p className="mt-1 text-sm text-accent">{p.tagline}</p>}
            {p.description && <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{p.description}</p>}
          </div>
        ))}
      </div>
    </Section>
  );
}
