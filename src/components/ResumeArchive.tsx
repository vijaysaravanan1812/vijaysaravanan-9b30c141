import { siteConfig } from "@/services/content";
import { Download } from "lucide-react";

/**
 * Optional Resume History section. Visible only if siteConfig.resumeArchive
 * has at least one entry with visible: true.
 */
export function ResumeArchive() {
  const items = (siteConfig.resumeArchive ?? []).filter((r) => r.visible);
  if (items.length === 0) return null;

  return (
    <section id="resumes" aria-label="Resume archive" className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-4 text-xs tracking-[0.2em] text-muted-foreground">// resume archive</div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((r) => (
          <li key={r.url}>
            <a
              href={r.url}
              download
              className="flex items-center justify-between rounded-lg border border-border bg-card/60 px-4 py-3 text-sm hover:border-accent/50"
            >
              <span>
                <span className="text-accent">{r.year}</span> — {r.label}
              </span>
              <Download className="h-4 w-4 text-muted-foreground" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
