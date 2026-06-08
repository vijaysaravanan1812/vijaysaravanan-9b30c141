import certifications from "@/data/certifications.json";
import { Section } from "./Section";

export function Certifications() {
  if (!certifications.visible) return null;
  const items = (certifications.items as Array<{ visible: boolean; certificate: string; organization?: string; year?: string | number }>).filter((c) => c.visible);
  if (items.length === 0) return null;

  return (
    <Section id="certifications" eyebrow="credentials" title="Certifications">
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((c, i) => (
          <div key={i} className="rounded-lg border border-border bg-card/60 p-5">
            <h3 className="text-sm font-semibold">{c.certificate}</h3>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{c.organization}</span>
              <span className="text-accent">{c.year}</span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
