import { about } from "@/services/content";
import { Section } from "./Section";
import { TypingText } from "./TypingText";

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
          <TypingText
            as="div"
            variant="chevron"
            text={about.principles.items.slice()}
            className="space-y-2 text-sm text-muted-foreground font-mono leading-relaxed"
            persistCursor
          />
        </div>
      )}
    </Section>
  );
}
