import { testimonials, visibleOnly } from "@/services/content";
import { Section } from "./Section";
import { Quote } from "lucide-react";

export function Testimonials() {
  if (!testimonials.visible) return null;
  const items = visibleOnly(testimonials.items);
  if (items.length === 0) return null;
  return (
    <Section id="testimonials" eyebrow="words" title="Testimonials">
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((t, i) => (
          <figure key={i} className="rounded-lg border border-border bg-card/60 p-5">
            <Quote className="h-5 w-5 text-accent" />
            <blockquote className="mt-3 text-sm leading-relaxed">{t.quote}</blockquote>
            <figcaption className="mt-4 text-xs text-muted-foreground">
              <span className="text-foreground">{t.author}</span>
              {t.role && <> — {t.role}</>}
              {t.company && <span className="text-accent">, {t.company}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
