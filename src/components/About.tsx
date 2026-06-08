import { about } from "@/services/content";
import { Section } from "./Section";
import { ChevronRight } from "lucide-react";

export function About() {
  if (!about.visible) return null;
  return (
    <Section id="about" eyebrow="about" title={about.heading}>
      <div className="space-y-5 text-muted-foreground leading-relaxed max-w-3xl">
        {about.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {about.principles && about.principles.items.length > 0 && (
        <div className="mt-10 rounded-lg border border-border bg-card/60 p-6">
          <div className="mb-4 text-sm text-foreground">
            <span className="text-accent">//</span> {about.principles.title}
          </div>
          <ul className="space-y-2">
            {about.principles.items.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 inline-block h-4 w-2 animate-pulse bg-accent align-middle" />
        </div>
      )}
    </Section>
  );
}
