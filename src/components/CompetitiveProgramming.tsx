import type { CompetitivePlatform } from "@/data/types";
import { competitiveProgramming, visibleOnly } from "@/services/content";
import { Section } from "./Section";
import { ExternalLink, Code2 } from "lucide-react";
import { TypingText } from "./TypingText";

export function CompetitiveProgramming() {
  if (!competitiveProgramming.visible) return null;
  const platforms = visibleOnly(competitiveProgramming.platforms);
  if (platforms.length === 0) return null;

  return (
    <Section
      id="competitive-programming"
      eyebrow="arena"
      title={competitiveProgramming.title || "Competitive Programming"}
    >
      {competitiveProgramming.subtitle && (
        <p className="-mt-8 mb-6 text-sm text-muted-foreground">
          {competitiveProgramming.subtitle}
        </p>
      )}
      <TypingText
        as="div"
        variant="dollar"
        text={platforms.flatMap((p) => {
          const out: string[] = [`Loading ${p.platform} profile...`];
          if (p.rating != null) out.push(`  ✓ Rating: ${p.rating}${p.rank ? ` (${p.rank})` : ""}`);
          if (p.problemsSolved != null) out.push(`  ✓ ${p.problemsSolvedLabel || p.problemsSolved} problems solved`);
          return out;
        })}
        speed={14}
        lineDelay={180}
        className="mb-8 font-mono text-xs text-muted-foreground space-y-1"
        persistCursor={false}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {platforms.map((p) => (
          <PlatformCard key={p.platform} p={p} />
        ))}
      </div>
    </Section>
  );
}

function PlatformCard({ p }: { p: CompetitivePlatform }) {
  const solvedDisplay =
    p.problemsSolvedLabel || (p.problemsSolved != null ? String(p.problemsSolved) : null);

  const breakdown =
    p.easySolved != null || p.mediumSolved != null || p.hardSolved != null
      ? [
          p.easySolved != null ? `E ${p.easySolved}` : null,
          p.mediumSolved != null ? `M ${p.mediumSolved}` : null,
          p.hardSolved != null ? `H ${p.hardSolved}` : null,
        ]
          .filter(Boolean)
          .join(" · ")
      : null;

  const peak =
    p.peakContest || p.peakContestRank != null
      ? `${p.peakContestRank != null ? `#${p.peakContestRank}` : ""}${
          p.peakContest ? ` (${p.peakContest})` : ""
        }`.trim()
      : null;

  return (
    <article className="flex flex-col rounded-lg border border-border bg-card/60 p-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-accent" aria-hidden />
          <h3 className="text-base font-semibold tracking-tight">{p.platform}</h3>
        </div>
        {p.profileUrl && (
          <a
            href={p.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${p.platform} profile`}
            className="text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </header>

      <dl className="mt-5 grid grid-cols-1 gap-4 text-center">
        {p.rating != null && <Stat label="Rating" value={p.rating} sub={p.rank || undefined} />}
        {solvedDisplay && (
          <Stat label="Problems Solved" value={solvedDisplay} sub={breakdown ?? undefined} />
        )}
        {(p.globalRank != null || p.countryRank != null) && (
          <Stat
            label={p.globalRank != null ? "Global Rank" : "Country Rank"}
            value={`#${p.globalRank ?? p.countryRank}`}
          />
        )}
        {peak && <Stat label="Peak Rank" value={peak} />}
      </dl>

      {(p.badges != null ||
        p.contestAttended != null ||
        p.peakRating != null ||
        p.streak != null) && (
        <div className="mt-5 flex flex-wrap gap-2 border-t border-border/60 pt-4">
          {p.peakRating != null && <Chip>Peak {p.peakRating}</Chip>}
          {p.badges != null && <Chip>{p.badges} badges</Chip>}
          {p.contestAttended != null && <Chip>{p.contestAttended} contests</Chip>}
          {p.streak != null && <Chip>{p.streak}-day streak</Chip>}
        </div>
      )}

      {p.lastUpdated && (
        <p className="mt-4 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
          Updated {p.lastUpdated}
        </p>
      )}
    </article>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div>
      <div className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-3xl font-bold tracking-tight text-accent">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-border/70 bg-background/40 px-2 py-0.5 text-[0.65rem] tracking-wide text-muted-foreground">
      {children}
    </span>
  );
}
