import {
  projects, publications, achievements, featuredOnly,
} from "@/services/content";
import { Section } from "./Section";
import { Star } from "lucide-react";

export function Featured() {
  const fp = featuredOnly(projects.items);
  const fr = featuredOnly(publications.items);
  const fa = featuredOnly(achievements.items);
  if (fp.length === 0 && fr.length === 0 && fa.length === 0) return null;

  return (
    <Section id="featured" eyebrow="highlights" title="Featured">
      <div className="grid gap-8">
        {fp.length > 0 && (
          <Group title="Projects">
            {fp.map((p, i) => (
              <Card key={i} title={p.title} subtitle={p.tags?.join(" · ")} detail={p.outcome} />
            ))}
          </Group>
        )}
        {fr.length > 0 && (
          <Group title="Research">
            {fr.map((p, i) => (
              <Card key={i} title={p.title} subtitle={[p.venue, p.year].filter(Boolean).join(" · ")} detail={p.authors} />
            ))}
          </Group>
        )}
        {fa.length > 0 && (
          <Group title="Achievements">
            {fa.map((a, i) => (
              <Card key={i} title={a.title} subtitle={a.category} detail={a.detail} />
            ))}
          </Group>
        )}
      </div>
    </Section>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-[0.7rem] tracking-[0.2em] text-muted-foreground">
        <Star className="h-3 w-3 text-accent" /> {title.toUpperCase()}
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

function Card({ title, subtitle, detail }: { title: string; subtitle?: string; detail?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/60 p-5">
      <h3 className="text-sm font-semibold">{title}</h3>
      {subtitle && <div className="mt-1 text-xs text-accent">{subtitle}</div>}
      {detail && <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{detail}</p>}
    </div>
  );
}
