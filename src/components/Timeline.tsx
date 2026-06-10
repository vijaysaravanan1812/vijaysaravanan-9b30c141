import { timeline, visibleOnly } from "@/services/content";
import { Section } from "./Section";
import { TypingText } from "./TypingText";

export function Timeline() {
  if (!timeline.visible) return null;
  const items = visibleOnly(timeline.items)
    .slice()
    .sort((a, b) => {
      const ay = Number(a.year) || 0;
      const by = Number(b.year) || 0;
      return by - ay;
    });
  if (items.length === 0) return null;

  const lines = items.map(
    (t) => `[${t.year}] ${t.title}${t.description ? ` — ${t.description}` : ""}`,
  );

  return (
    <Section id="timeline" eyebrow="career" title="Timeline">
      <TypingText
        as="div"
        variant="chevron"
        text={lines}
        speed={18}
        lineDelay={250}
        className="font-mono text-sm text-muted-foreground space-y-2 border-l border-border pl-6"
      />
    </Section>
  );
}
