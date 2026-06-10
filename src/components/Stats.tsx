import { autoStats } from "@/services/content";

/**
 * Auto-generated counts. Never manually enter these.
 * Renders nothing if every count is zero.
 */
export function Stats() {
  const s = autoStats();
  const entries: [string, number][] = [
    ["Projects", s.projects],
    ["Publications", s.publications],
    ["Talks", s.talks],
    ["Open Source", s.openSource],
    ["Certifications", s.certifications],
    ["Awards", s.awards],
    ["Achievements", s.achievements],
    ["Patents", s.patents],
  ].filter((e): e is [string, number] => typeof e[1] === "number" && e[1] > 0);

  if (entries.length === 0) return null;

  return (
    <section id="stats" aria-label="Career statistics" className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {entries.map(([label, n]) => (
          <div key={label} className="rounded-lg border border-border bg-card/40 p-4 text-center">
            <div className="text-2xl font-bold tracking-tight">{n}</div>
            <div className="mt-1 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
