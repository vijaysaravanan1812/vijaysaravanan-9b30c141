import { useEffect, useMemo, useState } from "react";
import {
  projects, publications, certifications, achievements, talks, openSource, blog, skills, awards,
  competitiveProgramming,
  visibleOnly,
} from "@/services/content";
import { Search, X } from "lucide-react";

type Hit = {
  kind: string;
  title: string;
  detail?: string;
  anchor: string; // e.g. #projects
  url?: string;
};

function buildIndex(): Hit[] {
  const items: Hit[] = [];

  for (const p of visibleOnly(projects.items)) {
    items.push({
      kind: "Project",
      title: p.title,
      detail: [p.tags?.join(" · "), p.outcome].filter(Boolean).join(" — "),
      anchor: "#projects",
      url: p.demo || p.github,
    });
  }
  for (const p of visibleOnly(publications.items)) {
    items.push({
      kind: "Publication",
      title: p.title,
      detail: [p.venue, p.year, p.authors].filter(Boolean).join(" · "),
      anchor: "#publications",
      url: p.link,
    });
  }
  for (const c of visibleOnly(certifications.items)) {
    items.push({
      kind: "Certification",
      title: c.certificate,
      detail: [c.organization, c.year].filter(Boolean).join(" · "),
      anchor: "#certifications",
    });
  }
  for (const a of visibleOnly(achievements.items)) {
    items.push({
      kind: "Achievement",
      title: a.title,
      detail: a.detail,
      anchor: "#achievements",
    });
  }
  for (const a of visibleOnly(awards.items)) {
    items.push({
      kind: "Award",
      title: a.title,
      detail: [a.issuer, a.year, a.detail].filter(Boolean).join(" · "),
      anchor: "#awards",
    });
  }
  for (const t of visibleOnly(talks.items)) {
    items.push({
      kind: "Talk",
      title: t.title,
      detail: [t.venue, t.date].filter(Boolean).join(" · "),
      anchor: "#talks",
      url: t.url,
    });
  }
  for (const o of visibleOnly(openSource.items)) {
    items.push({
      kind: "Open Source",
      title: o.project,
      detail: o.description,
      anchor: "#open-source",
      url: o.url,
    });
  }
  for (const b of visibleOnly(blog.items)) {
    items.push({
      kind: "Blog",
      title: b.title,
      detail: [b.date, b.summary].filter(Boolean).join(" — "),
      anchor: "#blog",
      url: b.url,
    });
  }
  for (const cat of visibleOnly(skills.categories)) {
    for (const s of cat.items) {
      items.push({
        kind: "Skill",
        title: s,
        detail: cat.name,
        anchor: "#skills",
      });
    }
  }
  if (competitiveProgramming.visible) {
    for (const p of visibleOnly(competitiveProgramming.platforms)) {
      const detail = [
        p.rating != null ? `Rating ${p.rating}` : null,
        p.rank || null,
        p.problemsSolvedLabel || (p.problemsSolved != null ? `${p.problemsSolved} solved` : null),
      ].filter(Boolean).join(" · ");
      items.push({
        kind: "Competitive Programming",
        title: p.platform,
        detail,
        anchor: "#competitive-programming",
        url: p.profileUrl || undefined,
      });
    }
  }
  return items;
}

function score(hit: Hit, q: string): number {
  const needle = q.toLowerCase();
  const hay = `${hit.title} ${hit.detail ?? ""} ${hit.kind}`.toLowerCase();
  if (!hay.includes(needle)) return 0;
  let s = 1;
  if (hit.title.toLowerCase().includes(needle)) s += 5;
  if (hit.title.toLowerCase().startsWith(needle)) s += 5;
  return s;
}

function highlight(text: string, q: string) {
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-accent/30 text-foreground rounded px-0.5">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export function SearchPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const index = useMemo(buildIndex, []);

  const results = useMemo(() => {
    if (!q.trim()) return index.slice(0, 8);
    return index
      .map((h) => ({ h, s: score(h, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 30)
      .map((x) => x.h);
  }, [q, index]);

  useEffect(() => setActive(0), [q, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
      else if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
      else if (e.key === "ArrowUp")   { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
      else if (e.key === "Enter")     { e.preventDefault(); pick(results[active]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function pick(hit?: Hit) {
    if (!hit) return;
    onOpenChange(false);
    if (hit.url) {
      window.open(hit.url, "_blank", "noopener,noreferrer");
    } else {
      window.location.hash = hit.anchor;
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className="fixed inset-0 z-[100] flex items-start justify-center bg-background/80 backdrop-blur-sm p-4 pt-[10vh]"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-xl rounded-lg border border-border bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects, talks, blog…"
            aria-label="Search portfolio"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button onClick={() => onOpenChange(false)} aria-label="Close search" className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <ul role="listbox" className="max-h-[60vh] overflow-y-auto">
          {results.length === 0 && (
            <li className="px-4 py-6 text-sm text-muted-foreground">No matches.</li>
          )}
          {results.map((h, i) => (
            <li
              key={`${h.kind}-${h.title}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(h)}
              className={`cursor-pointer border-b border-border/50 px-4 py-3 last:border-0 ${
                i === active ? "bg-accent/10" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium">{highlight(h.title, q)}</div>
                <span className="text-[0.65rem] uppercase tracking-wider text-accent">{h.kind}</span>
              </div>
              {h.detail && (
                <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {highlight(h.detail, q)}
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="border-t border-border px-4 py-2 text-[0.65rem] text-muted-foreground">
          ↑↓ navigate · ↵ open · esc close
        </div>
      </div>
    </div>
  );
}
